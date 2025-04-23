const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const checkRole = require('../middleware/checkRole');
const { Comentario } = require('../models');

// Ruta para obtener todos los comentarios
// Incluye la fecha y la puntuación de cada comentario.
router.get('/', comentarioController.getAllComentarios);

// Ruta para crear un nuevo comentario
// Permite a los usuarios enviar un comentario con puntuación y fecha.
router.post('/', comentarioController.createComentario);

// Ruta para que los camareros puedan moderar comentarios
// Permite a los camareros actualizar o eliminar comentarios.
// Se utiliza el middleware 'checkRole' para verificar que el usuario tenga el rol de 'camarero'.
router.put('/:id/moderar', checkRole('camarero'), comentarioController.moderateComentario);
router.delete('/:id', checkRole('camarero'), comentarioController.deleteComentario);

module.exports = router;