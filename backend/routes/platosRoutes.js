const express = require('express');
const router = express.Router();
const platosController = require('../controllers/platosController');
const checkRole = require('../middleware/checkRole');
const verifyToken = require('../middleware/verifyToken');  // Se añade para proteger las rutas que requieren autenticación
const multer = require('multer');

// Configurar almacenamiento temporal
const upload = multer({ dest: 'temp/' }); // Usa un directorio temporal

// Ruta para gestionar el plato (por ejemplo, para admin o gestión interna) [opcional]
//router.post('/', checkRole('camarero'), platosController.managePlato);

// Ruta para obtener los platos disponibles (clientes pueden verlos)
router.get('/available', platosController.getAvailablePlatos);

// Ruta para que los camareros añadan un nuevo plato (requiere autenticación y rol de "camarero")
router.post('/add', verifyToken, checkRole('camarero'),  upload.single('imagen'), platosController.addPlato);

// Ruta para que los camareros eliminen un plato (requiere autenticación y rol de "camarero")
router.delete('/delete/:platoId', verifyToken, checkRole('camarero'), platosController.deletePlato);

// Ruta para que los camareros actualicen un plato (requiere autenticación y rol de "camarero")
router.put('/update/:platoId', verifyToken, checkRole('camarero'), upload.single('imagen'), platosController.updatePlato);


module.exports = router;
