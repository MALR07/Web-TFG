/**
 * Middleware para verificar el rol de un usuario.
 *
 * @param {string} role - El rol requerido para acceder a la ruta.
 * @returns {Function} Middleware que verifica si el usuario tiene el rol adecuado.
 *
 * Este middleware comprueba si el usuario autenticado (req.user) tiene el rol especificado.
 * Si el rol coincide, permite el acceso llamando a next().
 * De lo contrario, responde con un código de estado 403 y un mensaje de error.
 */
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
  };
};

module.exports = checkRole;