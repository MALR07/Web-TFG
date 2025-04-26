const { Platos } = require('../models');
const verifyToken = require('../middleware/verifyToken'); // Middleware para verificar el JWT
const checkRole = require('../middleware/checkRole'); // Middleware para verificar el rol
const { Op } = require('sequelize'); // Asegúrate de importar Op

module.exports = {
  // Función para que los clientes vean los platos disponibles
  getAvailablePlatos: async (req, res) => {
    try {
      // Obtenemos los platos con cantidad disponible mayor a 0
      const platosDisponibles = await Platos.findAll({
        where: { cantidad_disponible: { [Op.gt]: 0 } }, // Usamos Op.gt para mayor que 0
      });
      
      // Retornamos los platos disponibles
      res.status(200).json(platosDisponibles);
    } catch (error) {
      // En caso de error, respondemos con un mensaje de error
      res.status(500).json({ message: 'Error al obtener los platos disponibles', error: error.message });
    }
  },

  // Función para que los camareros añadan un nuevo plato (requiere autenticación y rol de "camarero")
  addPlato: [verifyToken, checkRole('camarero'), async (req, res) => {
    try {
      const { nombre, descripcion, cantidad_disponible } = req.body;
      
      // Creamos el nuevo plato
      const nuevoPlato = await Platos.create({
        nombre,
        descripcion,
        cantidad_disponible,
      });
      
      // Respuesta exitosa
      res.status(201).json({ message: 'Plato añadido exitosamente', plato: nuevoPlato });
    } catch (error) {
      // Error al añadir el plato
      res.status(500).json({ message: 'Error al añadir el plato', error: error.message });
    }
  }],

  // Función para que los camareros eliminen un plato (requiere autenticación y rol de "camarero")
  deletePlato: [verifyToken, checkRole('camarero'), async (req, res) => {
    try {
      const { platoId } = req.params;
      
      // Buscamos el plato por su ID
      const plato = await Platos.findByPk(platoId);
      if (!plato) {
        return res.status(404).json({ message: 'Plato no encontrado' });
      }

      // Eliminamos el plato
      await plato.destroy();
      
      // Respuesta exitosa
      res.status(200).json({ message: 'Plato eliminado exitosamente' });
    } catch (error) {
      // Error al eliminar el plato
      res.status(500).json({ message: 'Error al eliminar el plato', error: error.message });
    }
  }],

  // Función para que los camareros actualicen un plato (requiere autenticación y rol de "camarero")
  updatePlato: [verifyToken, checkRole('camarero'), async (req, res) => {
    try {
      const { platoId } = req.params;
      const { nombre, descripcion, cantidad_disponible } = req.body;

      // Buscamos el plato que se desea actualizar
      const plato = await Platos.findByPk(platoId);
      if (!plato) {
        return res.status(404).json({ message: 'Plato no encontrado' });
      }

      // Actualizamos los campos del plato
      plato.nombre = nombre || plato.nombre;  // Si no se envía un nuevo nombre, mantenemos el actual
      plato.descripcion = descripcion || plato.descripcion;  // Lo mismo para la descripción
      plato.cantidad_disponible = cantidad_disponible || plato.cantidad_disponible;  // Y la cantidad disponible

      // Guardamos los cambios en la base de datos
      await plato.save();

      res.status(200).json({ message: 'Plato actualizado exitosamente', plato });
    } catch (error) {
      // Error al actualizar el plato
      res.status(500).json({ message: 'Error al actualizar el plato', error: error.message });
    }
  }],
};
