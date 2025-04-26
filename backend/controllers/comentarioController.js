// Importamos los modelos que vamos a utilizar
const { Comentario, User, Platos } = require('../models');

// Importamos jwt para verificar el token manualmente si es necesario
const jwt = require('jsonwebtoken');

// Middleware que valida el token y adjunta los datos del usuario a req.user
const verifyToken = require('../middleware/verifyToken');

module.exports = {

  // Obtener todos los comentarios junto con datos del usuario y del plato
  getAllComentarios: async (req, res) => {
    try {
      // Buscamos todos los comentarios e incluimos el nombre del usuario y el plato asociado
      const comentarios = await Comentario.findAll({
        attributes: ['id_comentario', 'comentario', 'puntuacion', 'fecha_comentario'],
        include: [
          { model: User, attributes: ['nombre'] },              // Traer el nombre del usuario que comentó
          { model: Platos, attributes: ['nombre'] }       // Traer el nombre del plato comentado
        ]
      });
      res.json(comentarios); // Enviamos los resultados como JSON
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener los comentarios',
        detalles: error.message
      });
    }
  },

  // Crear un nuevo comentario (requiere autenticación con token)
  createComentario: async (req, res) => {
    const { comentario, puntuacion, id_plato } = req.body;

    // Extraemos el token JWT del header Authorization
    const token = req.headers.authorization?.split(' ')[1];

    try {
      // Si no hay token, devolvemos error 401 (no autorizado)
      if (!token) return res.status(401).json({ message: 'Token requerido' });

      // Verificamos y decodificamos el token para obtener el id del usuario
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const id_user = decoded.id_user;

      // Validamos que se haya enviado comentario y puntuación
      if (!comentario || !puntuacion) {
        return res.status(400).json({
          message: 'Comentario y puntuación son requeridos'
        });
      }

      // Verificamos que el plato al que se comenta exista
      const plato = await Platos.findByPk(id_plato);
      if (!plato) {
        return res.status(404).json({ message: 'Plato no encontrado' });
      }

      // Creamos el nuevo comentario
      const nuevoComentario = await Comentario.create({
        comentario,
        puntuacion,
        id_user,
        id_plato,
      });

      res.status(201).json(nuevoComentario); // Comentario creado correctamente
    } catch (error) {
      res.status(400).json({
        error: 'Error al crear el comentario',
        detalles: error.message
      });
    }
  },

  // Moderar un comentario (solo usuarios con rol "camarero")
  moderateComentario: async (req, res) => {
    const { id } = req.params;            // ID del comentario a moderar
    const { estado, contenido } = req.body;
    const user = req.user;                // Usuario autenticado (obtenido desde verifyToken)

    try {
      // Buscamos el comentario por su ID
      const comentario = await Comentario.findByPk(id);

      if (!comentario) {
        return res.status(404).json({ message: 'Comentario no encontrado' });
      }

      // Verificamos que el usuario tenga rol "camarero"
      if (user.rol !== 'camarero') {
        return res.status(403).json({ message: 'No tienes permiso para moderar comentarios' });
      }

      // Actualizamos los campos de moderación
      comentario.estado = estado;
      comentario.contenido = contenido;
      await comentario.save();

      res.status(200).json({ message: 'Comentario moderado exitosamente', comentario });
    } catch (error) {
      res.status(500).json({
        error: 'Error al moderar el comentario',
        detalles: error.message
      });
    }
  },

  // Eliminar un comentario (autores o camareros)
  deleteComentario: async (req, res) => {
    const { id } = req.params;     // ID del comentario a eliminar
    const user = req.user;         // Usuario autenticado (desde verifyToken)

    try {
      // Buscamos el comentario
      const comentario = await Comentario.findByPk(id);

      if (!comentario) {
        return res.status(404).json({ message: 'Comentario no encontrado' });
      }

      // Solo puede eliminarlo el autor del comentario o un camarero
      if (comentario.id_user !== user.id_user && user.rol !== 'camarero') {
        return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
      }

      await comentario.destroy();
      res.status(200).json({ message: 'Comentario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({
        error: 'Error al eliminar el comentario',
        detalles: error.message
      });
    }
  },
};
