const { Reservas } = require('../models');

module.exports = {
  createReserva: async (req, res) => {
    try {
      const { clienteId, fecha } = req.body;

      // Crear la reserva
      const nuevaReserva = await Reservas.create({
        clienteId,
        fecha,
      });

      res.status(201).json({ message: 'Reserva creada exitosamente', reserva: nuevaReserva });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
    }
  },

  manageReserva: async (req, res) => {
    try {
      const { reservaId } = req.body;

      // Verificar si el usuario tiene rol de camarero
      if (req.user.role !== 'camarero') {
        return res.status(403).json({ message: 'No tienes permisos para gestionar reservas' });
      }

      // Buscar la reserva
      const reserva = await Reservas.findByPk(reservaId);
      if (!reserva) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }

      res.status(200).json({ message: 'Reserva gestionada exitosamente', reserva });
    } catch (error) {
      res.status(500).json({ message: 'Error al gestionar la reserva', error: error.message });
    }
  },
};