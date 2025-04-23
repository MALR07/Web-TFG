const express = require('express');
const router = express.Router();
const platosController = require('../controllers/platosController');
const checkRole = require('../middleware/checkRole');
const { Plato } = require('../models');

// Rutas de platos
router.post('/', checkRole('camarero'), platosController.managePlato);

module.exports = router;