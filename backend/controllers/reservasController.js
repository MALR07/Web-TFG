// Importamos las dependencias necesarias
require('dotenv').config();  // Cargar variables de entorno
const { Reservas, Platos, User } = require('../models');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken'); // Middleware de JWT
const checkRole = require('../middleware/checkRole'); // Middleware de checkRole

// Función para enviar correos electrónicos
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Usamos el email desde el archivo .env
      pass: process.env.EMAIL_APP_PASSWORD,  // Usamos la contraseña desde el archivo .env
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,  // Usamos el email de envío desde el archivo .env
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar correo:', error);
  }
};

// Función para verificar si la hora de la reserva es válida (solo viernes, sábado y domingo de 2 a 5 PM)
const isValidReservationTime = (fecha_reserva) => {
  const reservaDate = new Date(fecha_reserva);
  const day = reservaDate.getDay(); // 0 - Domingo, 1 - Lunes, ..., 6 - Sábado
  const hours = reservaDate.getHours(); // Hora de la reserva (0-23)

  // Solo se puede reservar entre las 2 PM y 5 PM los viernes, sábados y domingos
  return (day === 0 || day === 5 || day === 6) && (hours >= 14 && hours <= 17);
};

// Crear una reserva
module.exports = {
  createReserva: [verifyToken, async (req, res) => {
    const { id_plato, cantidad, fecha_reserva } = req.body;
    const id_usuario = req.user.id_user; // Obtener ID de usuario desde el token JWT

    // Verificamos si la reserva está dentro de las horas permitidas
    if (!isValidReservationTime(fecha_reserva)) {
      return res.status(400).json({ message: 'Solo se pueden hacer reservas entre las 2 PM y 5 PM los viernes, sábados y domingos.' });
    }

    try {
      // Buscar el plato y verificar si tiene suficientes platos disponibles
      const plato = await Platos.findByPk(id_plato);
      if (!plato) {
        return res.status(404).json({ message: 'Plato no encontrado' });
      }

      if (plato.cantidad_disponible < cantidad) {
        return res.status(400).json({ message: 'No hay suficiente cantidad disponible de este plato' });
      }

      // Crear la reserva
      const nuevaReserva = await Reservas.create({
        id_usuario,
        id_plato,
        cantidad,
        fecha_reserva,
        estado: 'confirmada',  // Estado inicial de la reserva
      });

      // Actualizar la cantidad disponible del plato después de la reserva
      plato.cantidad_disponible -= cantidad;
      await plato.save();

      // Obtener los datos del usuario que hizo la reserva
      const usuario = await User.findByPk(id_usuario);
      if (usuario) {
        // Enviar un correo de confirmación al cliente
        await sendEmail(
          usuario.email,
          'Confirmación de Reserva',
          `Tu reserva para el plato ${plato.nombre} ha sido confirmada. Fecha: ${fecha_reserva}.`
        );
      }

      res.status(201).json({ message: 'Reserva creada exitosamente', reserva: nuevaReserva });
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
    }
  }],

  // Función para gestionar las reservas (solo camareros pueden gestionarlas)
  manageReserva: [verifyToken, checkRole('camarero'), async (req, res) => {
    try {
      const { reservaId } = req.body;

      // Buscar la reserva
      const reserva = await Reservas.findByPk(reservaId);
      if (!reserva) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }

      res.status(200).json({ message: 'Reserva gestionada exitosamente', reserva });
    } catch (error) {
      console.error('Error al gestionar la reserva:', error);
      res.status(500).json({ message: 'Error al gestionar la reserva', error: error.message });
    }
  }],

  // Función para cancelar una reserva si el cliente no se presenta
  cancelReserva: [verifyToken, checkRole('camarero'), async (req, res) => {
    try {
      const { reservaId } = req.body;

      // Buscar la reserva
      const reserva = await Reservas.findByPk(reservaId);
      if (!reserva) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }

      // Cancelar la reserva
      await reserva.destroy();

      // Obtener el usuario asociado a la reserva
      const usuario = await User.findByPk(reserva.id_usuario);
      if (usuario) {
        // Enviar un correo al usuario notificando la cancelación
        await sendEmail(
          usuario.email,
          'Reserva Cancelada',
          `Lamentablemente, tu reserva para el plato ${reserva.Plato.nombre} ha sido cancelada debido a que no te presentaste en la hora de la reserva.`
        );
      }

      res.status(200).json({ message: 'Reserva cancelada exitosamente' });
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      res.status(500).json({ message: 'Error al cancelar la reserva', error: error.message });
    }
  }],

  // Función para verificar el token (JWT) si se requiere
  verifyJwtToken: [verifyToken, async (req, res) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>'
      
      if (!token) {
        return res.status(400).json({ message: 'Token no proporcionado' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
      res.status(200).json({ message: 'Token es válido', user: decoded });
    } catch (error) {
      return res.status(401).json({ message: 'Token no válido', error: error.message });
    }
  }],
};
