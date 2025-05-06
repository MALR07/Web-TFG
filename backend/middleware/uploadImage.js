const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Definir el directorio de destino para las imágenes
const uploadDirectory = 'uploads/';

// Verificar si la carpeta 'uploads' existe, y si no, crearla
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true }); // 'recursive' permite crear subdirectorios si es necesario
}

// Configuración del almacenamiento de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Comprobamos si la carpeta existe antes de intentar guardar los archivos
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }
    // Establecemos el destino de los archivos en la carpeta 'uploads/'
    cb(null, uploadDirectory); // La ruta es correcta, aquí no debería haber errores
  },
  filename: function (req, file, cb) {
    // Obtenemos la extensión del archivo subido
    const ext = path.extname(file.originalname);
    // Creamos un nombre único para el archivo
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName); // Asignamos el nombre único al archivo
  }
});

// Middleware de Multer
const upload = multer({ storage });

module.exports = upload;
