const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const sendPasswordRecoveryEmail = require('../config/mailer');

module.exports = {
  login: async (req, res) => {
    const { email, password, contrasena } = req.body;
    const userPassword = password || contrasena;
  
    try {
      if (!email || !userPassword) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
      }
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      if (!user.contrasena) {
        return res.status(500).json({ message: 'Error interno: contraseña no definida para el usuario' });
      }
  
      const hashAlmacenado = typeof user.contrasena === 'string'
        ? user.contrasena
        : user.contrasena.toString();
  
      const isMatch = await bcrypt.compare(userPassword, hashAlmacenado);
      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      const token = jwt.sign(
        { id_user: user.id_user, email: user.email, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
  },
  
  register: async (req, res) => {
    const { nombre, email, contrasena } = req.body;
  
    if (!contrasena || typeof contrasena !== 'string') {
      return res.status(400).json({ message: 'La contraseña es requerida y debe ser un string' });
    }
  
    try {
      // Verificar si ya existe algún camarero
      const existeCamarero = await User.findOne({ rol: 'camarero' });
  
      // Si no hay ningún camarero, este será el primero
      const rol = existeCamarero ? 'cliente' : 'camarero';
  
      const user = await User.create({ nombre, email, contrasena, rol });
  
      res.status(201).json({ message: `Usuario registrado como ${rol}`, user });
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  },
   

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: 'Correo no encontrado' });
      const token = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });
      await sendPasswordRecoveryEmail(email, token);
      res.status(200).json({ message: 'Correo enviado con éxito para recuperar la contraseña' });
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña:', error);
      res.status(500).json({ message: 'Error al enviar el correo' });
    }
  },

  resetPassword: async (req, res) => {
    const { token, newPassword } = req.body;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ where: { id_user: decoded.id_user } });
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      const salt = await bcrypt.genSalt(10);
      user.contrasena = await bcrypt.hash(newPassword, salt);
      await user.save();
      res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      res.status(500).json({ message: 'Error al restablecer la contraseña' });
    }
  }
};