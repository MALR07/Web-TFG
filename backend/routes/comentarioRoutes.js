const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const checkRole = require('../middleware/checkRole');
const { Comentario } = require('../models');
const verifyToken = require('../middleware/verifyToken');

// Ruta para obtener todos los comentarios
// Incluye la fecha y la puntuación de cada comentario.
router.get('/', comentarioController.getAllComentarios);

// Ruta para crear un nuevo comentario
// Permite a los usuarios enviar un comentario con puntuación y fecha.
router.post('/crear', verifyToken,checkRole('cliente'), comentarioController.createComentario);

// Ruta para que los camareros puedan moderar comentarios
// Permite a los camareros actualizar o eliminar comentarios.
// Se utiliza el middleware 'checkRole' para verificar que el usuario tenga el rol de 'camarero'.
router.put('/:id/moderar', verifyToken, checkRole('camarero'), comentarioController.moderateComentario);

// Ruta para eliminar un comentario
// Si el usuario es camarero, puede eliminar cualquier comentario.
// Si el usuario es cliente, solo puede eliminar su propio comentario.
router.delete('/:id', verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const comentario = await Comentario.findByPk(id);

  if (!comentario) {
    return res.status(404).json({ message: 'Comentario no encontrado' });
  }

  // Si el usuario es un cliente, solo puede eliminar su propio comentario
  if (req.user.rol === 'cliente' && req.user.id_user !== comentario.id_user) {
    return res.status(403).json({ message: 'No puedes eliminar un comentario que no es tuyo' });
  }

  // Si el usuario es camarero o cliente y su comentario, permite eliminarlo
  next();
}, comentarioController.deleteComentario);

module.exports = router;
