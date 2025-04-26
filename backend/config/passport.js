// Importar las dependencias necesarias
const passport = require('passport');

// Importar la estrategia local de Passport.js  
const { Strategy: LocalStrategy } = require('passport-local'); 

// Importar bcrypt para la comparación de contraseñas
const bcrypt = require('bcrypt'); 

// Importar el modelo desde el archivo index.js de models
const { User } = require('../models');

// Configurar la estrategia local de Passport.js
passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Usamos el email como el campo de login
    passwordField: 'contrasena' // El campo de contraseña será 'contrasena'
  },
  async (email, contrasena, done) => {
    try {
      // Buscar el usuario en la base de datos por su email
      const user = await User.findOne({ where: { email } });

      // Si no existe el usuario, devolver un error
      if (!user) {
        return done(null, false, { message: 'Correo electrónico no encontrado.' });
      }

      // Validar que la contraseña del usuario esté definida
      if (!user.contrasena) {
        return done(null, false, { message: 'Contraseña no definida para este usuario.' });
      }

      // Comparar la contraseña proporcionada con la almacenada en la base de datos
      const isMatch = await bcrypt.compare(contrasena, user.contrasena);

      // Si las contraseñas no coinciden, devolver un error
      if (!isMatch) {
        return done(null, false, { message: 'Contraseña incorrecta.' });
      }

      // Si todo es correcto, devolver el usuario
      return done(null, user);
    } catch (error) {
      console.error('Error en la estrategia de Passport:', error);
      return done(error);
    }
  }
));

// Serializar el usuario para la sesión
passport.serializeUser((user, done) => {
  done(null, user.id_user);
});

// Deserializar el usuario de la sesión
passport.deserializeUser(async (id_user, done) => {
  try {
    const user = await User.findByPk(id_user); // Recuperamos el usuario completo desde la base de datos
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware para proteger las rutas
module.exports = passport;

