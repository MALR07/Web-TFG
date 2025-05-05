const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const verifyToken = require('../middleware/verifyToken'); // Middleware para verificar el token JWT
const checkRole = require('../middleware/checkRole'); // Middleware para verificar el rol de usuario

// Ruta para que un cliente cree una reserva (solo clientes pueden crear reservas)
router.post('/crear', verifyToken, checkRole('cliente'), reservasController.createReserva);

// Ruta para que un camarero gestione una reserva (solo camareros pueden gestionar las reservas)
router.put('/gestionar', verifyToken, checkRole('camarero'), reservasController.manageReserva);

// Ruta para que un cliente vea sus propias reservas
router.get('/reservas', verifyToken, checkRole('cliente','camarero'), reservasController.getReservas);

// Ruta para que un camarero cancele una reserva
router.delete('/cancelar', verifyToken, checkRole('camarero','cliente'), reservasController.cancelReserva);

module.exports = router;
