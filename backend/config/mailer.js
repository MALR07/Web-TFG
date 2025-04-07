const nodemailer = require('nodemailer');

// Crear un transporte para enviar correos electrónicos
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Tu correo de Gmail
    pass: process.env.EMAIL_PASS,  // Tu contraseña de Gmail (o una contraseña de aplicación)
  }
});

// Función para enviar correos de recuperación de contraseña
const sendPasswordRecoveryEmail = (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Haz clic en el siguiente enlace para recuperar tu contraseña: ${process.env.BASE_URL}/reset-password?token=${token}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendPasswordRecoveryEmail;