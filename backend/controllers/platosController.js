const path = require('path');
const fs = require('fs');
const { Platos } = require('../models');
const verifyToken = require('../middleware/verifyToken'); // Middleware para verificar el JWT
const checkRole = require('../middleware/checkRole');     // Middleware para verificar el rol
const { Op } = require('sequelize');                      // Operadores de Sequelize

module.exports = {
  // Función para que los clientes vean los platos disponibles
  getAvailablePlatos: async (req, res) => {
    try {
      // Obtenemos los platos con cantidad disponible mayor a 0
      const platosDisponibles = await Platos.findAll({
        where: { cantidad_disponible: { [Op.gt]: 0 } },
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

      // Si se sube una imagen, la procesamos
      let imagen = null;
      if (req.file) {
        // Usamos path para asegurarnos de que la ruta es correcta
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename); // Ejemplo de ruta donde almacenar la imagen

        // Movemos el archivo subido al directorio 'uploads'
        fs.renameSync(req.file.path, filePath); // Cambia el archivo de ubicación

        imagen = req.file.filename; // Guardamos el nombre del archivo en la base de datos
      }

      // Creamos el nuevo plato con o sin imagen
      const nuevoPlato = await Platos.create({
        nombre,
        descripcion,
        cantidad_disponible,
        imagen,
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

      // Si el plato tiene imagen, la eliminamos del sistema de archivos
      if (plato.imagen) {
        const imagenPath = path.join(__dirname, '..', 'uploads', plato.imagen);
        if (fs.existsSync(imagenPath)) {
          fs.unlinkSync(imagenPath); // Eliminar el archivo de la imagen
        }
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

      // Si hay una nueva imagen, la procesamos
      if (req.file) {
        // Eliminar la imagen antigua si existe
        if (plato.imagen) {
          const imagenPath = path.join(__dirname, '..', 'uploads', plato.imagen);
          if (fs.existsSync(imagenPath)) {
            fs.unlinkSync(imagenPath); // Eliminar la imagen antigua
          }
        }

        // Usamos path para asegurarnos de que la ruta es correcta
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        fs.renameSync(req.file.path, filePath); // Movemos el archivo al directorio 'uploads'

        plato.imagen = req.file.filename; // Actualizamos el nombre de la imagen en la base de datos
      }

      // Actualizamos los campos del plato si fueron enviados
      plato.nombre = nombre || plato.nombre;
      plato.descripcion = descripcion || plato.descripcion;
      plato.cantidad_disponible = cantidad_disponible || plato.cantidad_disponible;

      // Guardamos los cambios en la base de datos
      await plato.save();

      res.status(200).json({ message: 'Plato actualizado exitosamente', plato });
    } catch (error) {
      // Error al actualizar el plato
      res.status(500).json({ message: 'Error al actualizar el plato', error: error.message });
    }
  }],
};
