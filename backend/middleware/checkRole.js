/**
 * Middleware para verificar el rol de un usuario.
 *
 * @param {...string} roles - Uno o más roles permitidos para acceder a la ruta.
 * @returns {Function} Middleware que verifica si el usuario tiene un rol válido.
 */
const checkRole = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.rol || req.user?.role; // por compatibilidad

    if (roles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
  };
};

module.exports = checkRole;
