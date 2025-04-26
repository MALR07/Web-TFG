const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Obtenemos el token del encabezado Authorization (debe ser enviado como 'Bearer <token>')
  const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado, token no proporcionado' });
  }

  try {
    // Verificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregamos la información del usuario decodificada al objeto request
    next(); // Llamamos al siguiente middleware o a la ruta
  } catch (error) {
    return res.status(403).json({ message: 'Token no válido', detalles: error.message });
  }
};
