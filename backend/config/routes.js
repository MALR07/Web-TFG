const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('./models/users'); // Asegúrate de que la ruta sea correcta

// Ruta de login
app.post('/login', async (req, res) => {
  const { email, contrasena } = req.body;

  // Buscar usuario en la base de datos
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Usuario no encontrado' });
  }

  // Comparar la contraseña
  const isMatch = await bcrypt.compare(contrasena, user.contrasena);
  if (!isMatch) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  // Crear el token JWT
  const token = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return res.json({ message: 'Login exitoso', token });
});
