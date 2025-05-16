const express = require('express');
const router = express.Router();
const authRoutes = require('./routes/authRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const platosRoutes = require('./routes/platosRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const usuariosRoutes = require('./routes/UserRoutes');



// Rutas principales
router.use('/auth', authRoutes);
router.use('/comentarios', comentarioRoutes);
router.use('/platos', platosRoutes);
router.use('/reservas', reservasRoutes);
router.use('/usuarios', usuariosRoutes);
module.exports = router;