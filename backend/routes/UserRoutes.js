// backend/routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

router.post('/', verifyToken, checkRole('camarero'), usuariosController.createUsuario);  // Crear usuario
router.put('/:id_user', verifyToken, checkRole('camarero'), usuariosController.updateUsuario); // Actualizar usuario
router.get('/:id_user', verifyToken, checkRole('camarero'), usuariosController.getUsuarioById); // Obtener usuario por ID
router.get('/', verifyToken, checkRole('camarero'), usuariosController.getAllUsuarios);  // Obtener todos los usuarios
router.delete('/:id_user', verifyToken, checkRole('camarero'), usuariosController.deleteUsuario); // Eliminar usuario

module.exports = router;
