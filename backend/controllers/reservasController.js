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

 getReservas: [verifyToken, checkRole('cliente', 'camarero'), async (req, res) => {
  const id_usuario = req.user.id_user; // Obtener ID de usuario desde el token JWT
  const rol = req.user.rol;  // Obtener el rol del usuario (cliente o camarero)

  try {
    // Si el rol es cliente, obtenemos solo sus propias reservas, si es camarero, todas las reservas
    const whereCondition = rol === 'cliente' ? { id_usuario } : {};  // Si es cliente, solo las reservas suyas

    // Buscar todas las reservas (si es cliente, solo las de ese cliente, si es camarero, todas las reservas)
    const reservas = await Reservas.findAll({
      where: whereCondition,  // Condición de búsqueda: por id_usuario si es cliente
      include: [
        {
          model: Platos,  // Incluir el modelo 'Platos'
          as: 'Plato',   // El alias por defecto es 'Platos' (sin modificarlo)
          attributes: ['id_plato', 'nombre', 'descripcion', 'cantidad_disponible'],  // Aseguramos que los atributos de Platos se incluyan
        },
        {
          model: User,     // Incluir el modelo 'User'
          as: 'User',      // El alias por defecto es 'User' (sin modificarlo)
          attributes: ['id_user', 'nombre', 'email'],  // Incluir el id, nombre y email del usuario
        }
      ],
    });

    // Si no se encuentran reservas, devolver un mensaje adecuado
    if (reservas.length === 0) {
      return res.status(404).json({
        message: rol === 'cliente' ? 'No tienes reservas pendientes' : 'No hay reservas registradas'
      });
    }

    // Convertir la fecha de cada reserva a UTC usando .toISOString()
    const reservasConFechasUTC = reservas.map(reserva => {
      const fechaReservaUTC = new Date(reserva.fecha_reserva).toISOString();
      return {
        ...reserva.toJSON(),
        fecha_reserva: fechaReservaUTC, // Sustituir la fecha original con la versión UTC
      };
    });

    // Devolver las reservas encontradas con las fechas convertidas a UTC
    res.status(200).json({ reservas: reservasConFechasUTC });
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
  }
}],


  // Función para cambiar el estado de una reserva (solo camareros pueden modificar el estado)
manageReserva: [verifyToken, checkRole('camarero'), async (req, res) => {
  try {
    const { reservaId, nuevoEstado } = req.body;

    // Verificar que el nuevo estado sea válido
    const estadosValidos = ['confirmada', 'presentado', 'expirada'];
    if (!estadosValidos.includes(nuevoEstado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    // Buscar la reserva por su ID
    const reserva = await Reservas.findByPk(reservaId, {
      include: [
        {
          model: Platos,
          as: 'Plato', // Obtener los platos relacionados con la reserva
        },
      ],
    });

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Verificar si el estado de la reserva es el mismo que el nuevo estado
    if (reserva.estado === nuevoEstado) {
      return res.status(400).json({ message: 'El estado de la reserva ya es el mismo' });
    }

    // Actualizar el estado de la reserva
    reserva.estado = nuevoEstado;
    await reserva.save(); // Guardar los cambios en la base de datos

    res.status(200).json({
      message: 'Estado de la reserva actualizado exitosamente',
      reserva,
    });
  } catch (error) {
    console.error('Error al gestionar el estado de la reserva:', error);
    res.status(500).json({ message: 'Error al gestionar el estado de la reserva', error: error.message });
  }
}],

  // Función para cancelar una reserva
  cancelReserva: [verifyToken, async (req, res) => {
    try {
      const { reservaId } = req.body;
      const id_usuario = req.user.id_user;
      const rol = req.user.rol;

      const reserva = await Reservas.findByPk(reservaId, {
        include: [
          {
            model: Platos, // Incluir los platos relacionados con la reserva
            as: 'Plato',
          },
        ],
      });

      if (!reserva) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }

      // Verificamos que el cliente solo pueda cancelar su propia reserva
      if (rol === 'cliente' && reserva.id_usuario !== id_usuario) {
        return res.status(403).json({ message: 'No tenés permiso para cancelar esta reserva' });
      }

      // Si el camarero está cancelando, no hay restricción de quien hizo la reserva
      if (rol === 'camarero') {
        // El camarero puede cancelar cualquier reserva
      }

      // Si la reserva es cancelada por un cliente o camarero, actualizar la cantidad del plato
      const plato = reserva.Plato;
      plato.cantidad_disponible += reserva.cantidad;
      await plato.save();

      // Eliminar la reserva de la base de datos
      await reserva.destroy();

      // Enviar correo al usuario notificando la cancelación de la reserva
      const usuario = await User.findByPk(reserva.id_usuario);
      if (usuario) {
        await sendEmail(
          usuario.email,
          'Reserva Cancelada',
          `Lamentablemente, tu reserva para el plato ${plato.nombre} ha sido cancelada.`
        );
      }

      res.status(200).json({ message: 'Reserva cancelada exitosamente y cantidad de plato actualizada' });
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      res.status(500).json({ message: 'Error al cancelar la reserva', error: error.message });
    }
  }],

  // Función para verificar el token (JWT)
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

 checkAndExpireReservations: async () => {
  try {
    const ahora = new Date(); // Hora actual local (puede ser UTC o no)
    const fechaLimite = new Date(ahora.getTime() - 20 * 60 * 1000); // Ahora - 20 min

    // Buscar todas las reservas confirmadas
    const reservasConfirmadas = await Reservas.findAll({
      where: {
        estado: 'confirmada'
      }
    });

    for (const reserva of reservasConfirmadas) {
      const fechaReserva = new Date(reserva.fecha_reserva);
      
      // Restar 2 horas a la fecha_reserva para llevarla a UTC
      const fechaReservaUTC = new Date(fechaReserva.getTime() - 2 * 60 * 60 * 1000);

      // Si la fecha_reserva corregida es menor o igual a la fecha límite (ahora-20min)
      if (fechaReservaUTC <= fechaLimite) {
        reserva.estado = 'expirada';
        await reserva.save();
        console.log(`Reserva ${reserva.id_reserva} marcada como expirada.`);
      }
    }
  } catch (error) {
    console.error('Error expirando reservas:', error);
  }
},

  //Función para borrar reservas expiradas cada lunes a la medianoche
  deleteExpiredReservations: async () => {
    try {
      await Reservas.destroy({
        where: { estado: 'expirada' }
      });
      console.log('Reservas expiradas eliminadas.');
    } catch (error) {
      console.error('Error eliminando reservas expiradas:', error);
    }
  },

};



