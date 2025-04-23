const models = require('../models');

module.exports = {
  managePlato: (req, res) => {
    res.send('Plato gestionado exitosamente');
  },

  // Función para que los clientes vean los platos disponibles
  getAvailablePlatos: async (req, res) => {
    try {
      const platosDisponibles = await models.Platos.findAll({
        where: { cantidad_disponible: { [Op.gt]: 0 } },
      });
      res.status(200).json(platosDisponibles);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los platos disponibles', error: error.message });
    }
  },

  // Función para que los camareros añadan un nuevo plato
  addPlato: async (req, res) => {
    try {
      const { nombre, descripcion, cantidad_disponible } = req.body;
      const nuevoPlato = await models.Platos.create({
        nombre,
        descripcion,
        cantidad_disponible,
      });
      res.status(201).json({ message: 'Plato añadido exitosamente', plato: nuevoPlato });
    } catch (error) {
      res.status(500).json({ message: 'Error al añadir el plato', error: error.message });
    }
  },

  // Función para que los camareros eliminen un plato
  deletePlato: async (req, res) => {
    try {
      const { platoId } = req.params;
      const plato = await models.Platos.findByPk(platoId);
      if (!plato) {
        return res.status(404).json({ message: 'Plato no encontrado' });
      }
      await plato.destroy();
      res.status(200).json({ message: 'Plato eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el plato', error: error.message });
    }
  },
};