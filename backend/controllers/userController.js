// backend/controllers/usuariosController.js
const bcrypt = require('bcrypt');
const { User } = require('../models');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');
const nodemailer = require('nodemailer');
require('dotenv').config();

// --- Función para enviar correos --- (Por ejemplo, para confirmar el registro o la modificación de un usuario)
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar correo:', error);
  }
};

// --- Controladores --- 
module.exports = {
  
 createUsuario: [verifyToken, checkRole('camarero'), async (req, res) => {
  const { nombre, email, contrasena, rol } = req.body;

  // Verificamos que el rol sea válido
  if (rol !== 'camarero' && rol !== 'cliente') {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    // Verificamos si el email ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const newUser = await User.create({
      nombre,
      email,
      contrasena: hashedPassword,
      rol,
    });

    // Enviar correo de bienvenida
    await sendEmail(
      newUser.email,
      'Bienvenido a nuestro servicio',
      `Hola ${newUser.nombre}, tu cuenta ha sido creada exitosamente.`
    );

    // Devolver usuario sin contraseña
    const userWithoutPassword = { ...newUser.toJSON() };
    delete userWithoutPassword.contrasena;

    res.status(201).json({ message: 'Usuario creado', user: userWithoutPassword });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
}],

  updateUsuario: [verifyToken, checkRole('camarero'), async (req, res) => {
  const { id_user } = req.params;
  const { nombre, email, contrasena, rol } = req.body;

  try {
    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si se pasa una nueva contraseña, la encriptamos
    let updatedPassword = user.contrasena; // Mantiene la contraseña anterior si no se pasa una nueva
    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(contrasena, salt);
    }

    // Actualizar el usuario
    await user.update({
      nombre: nombre ?? user.nombre,
      email: email ?? user.email,
      contrasena: updatedPassword,
      rol: rol ?? user.rol,
    });

    // Enviar correo de confirmación
    await sendEmail(
      user.email,
      'Datos de Usuario Actualizados',
      `Hola ${user.nombre}, tus datos han sido actualizados exitosamente.`
    );

    // Devolver usuario sin contraseña
    const updatedUser = { ...user.toJSON() };
    delete updatedUser.contrasena;

    res.status(200).json({ message: 'Usuario actualizado', user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
}],


  // Obtener un usuario por ID
  getUsuarioById: [verifyToken, checkRole('camarero'), async (req, res) => {
    const { id_user } = req.params;

    try {
      const user = await User.findByPk(id_user);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Devolvemos el usuario sin la contraseña
      const userWithoutPassword = { ...user.toJSON() };
      delete userWithoutPassword.contrasena;

      res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
  }],

  // Obtener todos los usuarios
  getAllUsuarios: [verifyToken, checkRole('camarero'), async (req, res) => {
    try {
      const usuarios = await User.findAll();

      // Devolvemos todos los usuarios sin la contraseña
      const usuariosSinContrasena = usuarios.map((user) => {
        const userObj = user.toJSON();
        delete userObj.contrasena;
        return userObj;
      });

      res.status(200).json({ usuarios: usuariosSinContrasena });
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
  }],
  
  // Eliminar un usuario
  deleteUsuario: [verifyToken, checkRole('camarero'), async (req, res) => {
    const { id_user } = req.params;

    try {
      const user = await User.findByPk(id_user);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      await user.destroy();
      res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
  }],
};

