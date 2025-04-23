const { Comentario, User, Plato } = require('../models');

module.exports = {
  // Método para obtener todos los comentarios
  // Incluye la fecha y la puntuación de cada comentario.
  getAllComentarios: async (req, res) => {
    try {
      const comentarios = await Comentario.findAll({
        attributes: ['id_comentario', 'comentario', 'puntuacion', 'fecha_comentario'],
      });
      res.json(comentarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los comentarios' });
    }
  },

  // Método para crear un nuevo comentario
  // Requiere que el usuario envíe el comentario, la puntuación y opcionalmente el plato asociado.
  createComentario: async (req, res) => {
    const { comentario, puntuacion, id_user, id_plato } = req.body;
    try {
      const nuevoComentario = await Comentario.create({
        comentario,
        puntuacion,
        id_user,
        id_plato,
      });
      res.status(201).json(nuevoComentario);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el comentario', detalles: error.message });
    }
  },

  // Método para moderar un comentario
  // Permite a los camareros actualizar el estado o contenido de un comentario.
  moderateComentario: (req, res) => {
    const { id } = req.params;
    const { estado, contenido } = req.body;
    // Lógica para actualizar el comentario en la base de datos
    res.send(`Comentario con ID ${id} moderado exitosamente`);
  },

  // Método para eliminar un comentario
  // Permite a los camareros eliminar un comentario por su ID.
  deleteComentario: (req, res) => {
    const { id } = req.params;
    // Lógica para eliminar el comentario de la base de datos
    res.send(`Comentario con ID ${id} eliminado exitosamente`);
  }
};