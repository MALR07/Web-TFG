const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const sendPasswordRecoveryEmail = require('../config/mailer');

module.exports = {
  login: (req, res) => {
    // Lógica de autenticación con Passport.js
    res.send('Login exitoso');
  },

  register: async (req, res) => {
    const { nombre, email, contrasena, rol } = req.body;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasena, salt);
      const user = await User.create({ nombre, email, contrasena: hashedPassword, rol });
      res.status(201).json({ message: 'Usuario registrado exitosamente', user });
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