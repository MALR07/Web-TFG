require('dotenv').config();
const { Reservas, Platos, User } = require('../models');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');
const { Op } = require('sequelize');

// --- Función para enviar correos ---
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar correo:', error);
  }
};

// --- Función para validar horario de reserva ---
const isValidReservationTime = (fecha_reserva) => {
  const reservaDate = new Date(fecha_reserva);
  const day = reservaDate.getDay(); // 0=Dom,5=Vie,6=Sáb
  const hours = reservaDate.getHours();

  // Viernes, sábado y domingo, entre 14 y 17 horas
  return (day === 0 || day === 5 || day === 6) && (hours >= 14 && hours <= 17);
};

// --- Controladores ---
module.exports = {

  createReserva: [verifyToken, async (req, res) => {
    const { id_plato, cantidad, fecha_reserva } = req.body;
    const id_usuario = req.user.id_user;

    if (!isValidReservationTime(fecha_reserva)) {
      return res.status(400).json({ message: 'Solo reservas entre 14 y 17h viernes, sábado y domingo' });
    }

    try {
      const plato = await Platos.findByPk(id_plato);
      if (!plato) return res.status(404).json({ message: 'Plato no encontrado' });

      if (plato.cantidad_disponible < cantidad) {
        return res.status(400).json({ message: 'Cantidad insuficiente disponible' });
      }

      const nuevaReserva = await Reservas.create({
        id_usuario, id_plato, cantidad, fecha_reserva, estado: 'confirmada',
      });

      plato.cantidad_disponible -= cantidad;
      await plato.save();

      const usuario = await User.findByPk(id_usuario);
      if (usuario) {
        await sendEmail(usuario.email,
          'Confirmación de Reserva',
          `Tu reserva para ${plato.nombre} ha sido confirmada. Fecha: ${fecha_reserva}`);
      }

      res.status(201).json({ message: 'Reserva creada', reserva: nuevaReserva });
    } catch (error) {
      console.error('Error crear reserva:', error);
      res.status(500).json({ message: 'Error al crear reserva', error: error.message });
    }
  }],

  getReservas: [verifyToken, checkRole('cliente', 'camarero'), async (req, res) => {
    const id_usuario = req.user.id_user;
    const rol = req.user.rol;
    try {
      const whereCondition = rol === 'cliente' ? { id_usuario } : {};
      const reservas = await Reservas.findAll({
        where: whereCondition,
        include: [
          { model: Platos, as: 'Plato', attributes: ['id_plato', 'nombre', 'descripcion', 'cantidad_disponible'] },
          { model: User, as: 'User', attributes: ['id_user', 'nombre', 'email'] },
        ],
      });
      if (!reservas.length) {
        return res.status(404).json({ message: rol === 'cliente' ? 'No tienes reservas' : 'No hay reservas' });
      }
      res.status(200).json({ reservas });
    } catch (error) {
      console.error('Error obtener reservas:', error);
      res.status(500).json({ message: 'Error al obtener reservas', error: error.message });
    }
  }],

  manageReserva: [
  verifyToken,
  checkRole('camarero'),
  async (req, res) => {
    const { reservaId, nuevoEstado } = req.body;  // Recibimos el nuevo estado desde el body

    try {
      const reserva = await Reservas.findByPk(reservaId, {
        include: [{ model: Platos, as: 'Plato' }],
      });

      if (!reserva) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }

      // Validar que el nuevoEstado sea uno válido, opcionalmente:
      const estadosValidos = ['confirmada', 'cancelada', 'presentado'];
      if (!estadosValidos.includes(nuevoEstado)) {
        return res.status(400).json({ message: 'Estado inválido' });
      }

      reserva.estado = nuevoEstado;
      await reserva.save();

      res.status(200).json({ message: `Reserva actualizada a estado '${nuevoEstado}'`, reserva });
    } catch (error) {
      console.error('Error gestionar reserva:', error);
      res.status(500).json({ message: 'Error al gestionar reserva', error: error.message });
    }
  }
],

  cancelReserva: [verifyToken, async (req, res) => {
    const { reservaId } = req.body;
    const id_usuario = req.user.id_user;
    const rol = req.user.rol;
    try {
      const reserva = await Reservas.findByPk(reservaId, { include: [{ model: Platos, as: 'Plato' }] });
      if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });

      if (rol === 'cliente' && reserva.id_usuario !== id_usuario) {
        return res.status(403).json({ message: 'No podés cancelar esta reserva' });
      }

      reserva.Plato.cantidad_disponible += reserva.cantidad;
      await reserva.Plato.save();

      await reserva.destroy();

      const usuario = await User.findByPk(reserva.id_usuario);
      if (usuario) {
        await sendEmail(usuario.email,
          'Reserva Cancelada',
          `Tu reserva para ${reserva.Plato.nombre} ha sido cancelada.`);
      }

      res.status(200).json({ message: 'Reserva cancelada y cantidad actualizada' });
    } catch (error) {
      console.error('Error cancelar reserva:', error);
      res.status(500).json({ message: 'Error al cancelar reserva', error: error.message });
    }
  }],

  verifyJwtToken: [verifyToken, async (req, res) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) return res.status(400).json({ message: 'Token no proporcionado' });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ message: 'Token válido', user: decoded });
    } catch (error) {
      res.status(401).json({ message: 'Token no válido', error: error.message });
    }
  }],
  
  // --- Función para el cron job de reservas expiradas ---
  checkAndExpireReservations: async () => {
    try {
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

      const reservasExpiradas = await Reservas.findAll({
        where: {
          estado: 'confirmada',
          fecha_reserva: { [Op.lt]: tenMinutesAgo },
        },
        include: [
          { model: Platos, as: 'Plato' },
          { model: User, as: 'User' },
        ],
      });

      for (const reserva of reservasExpiradas) {
        reserva.Plato.cantidad_disponible += reserva.cantidad;
        await reserva.Plato.save();

        if (reserva.User && reserva.User.email) {
          await sendEmail(
            reserva.User.email,
            'Reserva Expirada',
            `Tu reserva para ${reserva.Plato.nombre} ha expirado por no presentarte a tiempo.`
          );
        }

        await reserva.destroy();

        console.log(`Reserva ID ${reserva.id} expirada y eliminada.`);
      }
    } catch (error) {
      console.error('Error en cron para reservas expiradas:', error);
    }
  },

};