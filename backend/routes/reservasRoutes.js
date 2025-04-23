const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const checkRole = require('../middleware/checkRole');
const { Reserva } = require('../models');

// Ruta para que un cliente cree una reserva
router.post('/crear', reservasController.createReserva);

// Ruta para que un camarero gestione una reserva
router.put('/gestionar', checkRole('camarero'), reservasController.manageReserva);

module.exports = router;