const path = require('path');
const fs = require('fs');
const { Platos } = require('../models');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');
const { Op } = require('sequelize');

module.exports = {
  // Obtener platos disponibles
  getAvailablePlatos: async (req, res) => {
    try {
      const platosDisponibles = await Platos.findAll({
        where: { cantidad_disponible: { [Op.gt]: 0 } },
      });
      res.status(200).json(platosDisponibles);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los platos disponibles', error: error.message });
    }
  },

  // Añadir un nuevo plato
  addPlato: [verifyToken, checkRole('camarero'), async (req, res) => {
    try {
      const { nombre, descripcion, cantidad_disponible, imagen_url } = req.body;
      let imagen = null;

      // Si el usuario proporciona una URL de la imagen, usamos esa URL
      if (imagen_url) {
        imagen = imagen_url;
      } else if (req.file) {
        // Si no se proporciona URL, guardamos la imagen en public/uploads
        const publicUploadsPath = path.join(__dirname, '..', 'public', 'uploads');
        const filePath = path.join(publicUploadsPath, req.file.filename);

        // Crear la carpeta si no existe
        if (!fs.existsSync(publicUploadsPath)) fs.mkdirSync(publicUploadsPath, { recursive: true });

        // Mover el archivo subido a la carpeta public/uploads
        fs.renameSync(req.file.path, filePath);

        // La imagen se guarda como una ruta pública
        imagen = `/uploads/${req.file.filename}`;
      }

      const nuevoPlato = await Platos.create({
        nombre,
        descripcion,
        cantidad_disponible,
        imagen,
      });

      res.status(201).json({ message: 'Plato añadido exitosamente', plato: nuevoPlato });
    } catch (error) {
      res.status(500).json({ message: 'Error al añadir el plato', error: error.message });
    }
  }],

  // Eliminar un plato
  deletePlato: [verifyToken, checkRole('camarero'), async (req, res) => {
    try {
      const { platoId } = req.params;
      const plato = await Platos.findByPk(platoId);
      if (!plato) return res.status(404).json({ message: 'Plato no encontrado' });

      // Eliminar imagen local solo si es un archivo subido (no URL externa)
      if (plato.imagen && !plato.imagen.startsWith('http')) {
        const imagenPath = path.join(__dirname, '..', 'public', plato.imagen);
        if (fs.existsSync(imagenPath)) fs.unlinkSync(imagenPath); // Eliminar el archivo de imagen
      }

      await plato.destroy();
      res.status(200).json({ message: 'Plato eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el plato', error: error.message });
    }
  }],

  // Actualizar un plato
  updatePlato: [verifyToken, checkRole('camarero'), async (req, res) => {
    try {
      const { platoId } = req.params;
      const { nombre, descripcion, cantidad_disponible, imagen_url } = req.body;

      const plato = await Platos.findByPk(platoId);
      if (!plato) return res.status(404).json({ message: 'Plato no encontrado' });

      // Actualizar la imagen si se proporciona una nueva (puede ser URL o archivo)
      if (imagen_url) {
        // Si tenía una imagen local antes, la eliminamos
        if (plato.imagen && !plato.imagen.startsWith('http')) {
          const oldImagePath = path.join(__dirname, '..', 'public', plato.imagen);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath); // Eliminar imagen anterior
        }
        plato.imagen = imagen_url;
      } else if (req.file) {
        // Si hay un archivo subido, eliminamos la imagen anterior (si es local)
        if (plato.imagen && !plato.imagen.startsWith('http')) {
          const oldImagePath = path.join(__dirname, '..', 'public', plato.imagen);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }

        // Guardamos la nueva imagen en la carpeta public/uploads
        const publicUploadsPath = path.join(__dirname, '..', 'public', 'uploads');
        const filePath = path.join(publicUploadsPath, req.file.filename);

        // Crear la carpeta si no existe
        if (!fs.existsSync(publicUploadsPath)) fs.mkdirSync(publicUploadsPath, { recursive: true });

        // Mover el archivo a public/uploads
        fs.renameSync(req.file.path, filePath);

        plato.imagen = `/uploads/${req.file.filename}`; // Guardamos la URL relativa
      }

      // Actualizamos los demás campos del plato
      plato.nombre = nombre || plato.nombre;
      plato.descripcion = descripcion || plato.descripcion;
      plato.cantidad_disponible = cantidad_disponible || plato.cantidad_disponible;

      // Guardamos los cambios
      await plato.save();

      res.status(200).json({ message: 'Plato actualizado exitosamente', plato });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el plato', error: error.message });
    }
  }],
};
