// Importamos los módulos necesarios
const express = require('express');
const session = require('express-session');
const flash = require('express-flash'); // Para mostrar mensajes flash
const passport = require('./config/passport');  
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');  // Para crear y verificar tokens JWT
const bcrypt = require('bcryptjs');  // Para encriptar contraseñas
const sendPasswordRecoveryEmail = require('./config/mailer'); // Para el envío de correos
const sequelize = require('./config/database'); // Configuración de la base de datos con Sequelize

// Importar modelos
const User = require('./models/users');
const Plato = require('./models/platos');
const Reserva = require('./models/reservas');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear una instancia de la aplicación Express
const app = express();

// Definir el puerto en el que el servidor va a escuchar
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());  // Habilitar CORS
app.use(express.json()); // Este middleware permite que el servidor entienda y procese datos en formato JSON
app.use(express.urlencoded({ extended: true }));  // Analizar cuerpos de solicitudes URL-encoded

// Middleware para gestionar los mensajes flash
app.use(flash());  // Añadir este middleware para que los mensajes flash funcionen correctamente

// Middleware para verificar el rol
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.rol === role) {
      return next();  // El usuario tiene el rol adecuado, puede continuar
    }
    return res.status(403).json({ message: 'Acceso denegado' });  // Si no tiene el rol, denegamos acceso
  };
};
// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',  // Secreto para firmar la sesión
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Configura 'secure: true' si usamos HTTPS
}));

// Inicializamos Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Verificamos la conexión con la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa!');
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });

// Sincronización de los modelos con la base de datos
sequelize.sync({ force: false })  // 'force: false' evita que se eliminen y recreen las tablas si ya existen
  .then(() => {
    console.log('Las tablas están sincronizadas correctamente.');
  })
  .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
  });

// Ruta de login con Passport.js
app.post('/login', passport.authenticate('local', { 
  successRedirect: '/dashboard', // Si el login es exitoso, redirigir al dashboard
  failureRedirect: '/login',     // Si falla, redirigir a la página de login
  failureFlash: true             // Si hay errores, los muestra en el flash
}));

// Ruta de registro
app.post('/register', async (req, res) => {
  const { nombre, email, contrasena, rol } = req.body;

  try {
    // Encriptar la contraseña antes de guardarla en la base de datos
    const salt = await bcrypt.genSalt(10);  // Generamos un salt
    const hashedPassword = await bcrypt.hash(contrasena, salt);  // Encriptamos la contraseña

    // Crear un nuevo usuario con la contraseña encriptada
    const user = await User.create({
      nombre,
      email,
      contrasena: hashedPassword,  // Guardamos la contraseña encriptada
      rol // Puede ser 'usuario' o 'camarero'
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});


// Ruta de dashboard (sólo accesible después de login exitoso)
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login'); // Redirigir a la página de login si no está autenticado
  }
  res.send('Bienvenido al dashboard');
});

// Ruta para solicitar la recuperación de contraseña (enviar un correo con el token)
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    // Buscar al usuario por correo
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Correo no encontrado' });
    }

    // Generar un token para la recuperación de la contraseña
    const token = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar correo con el token
    await sendPasswordRecoveryEmail(email, token);

    res.status(200).json({ message: 'Correo enviado con éxito para recuperar la contraseña' });
  } catch (error) {
    console.error('Error al solicitar recuperación de contraseña:', error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
});

// Ruta para restablecer la contraseña
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario por su id_user
    const user = await User.findOne({ where: { id_user: decoded.id_user } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.contrasena = await bcrypt.hash(newPassword, salt);

    // Guardar la nueva contraseña
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
});

// Rutas para los **Camareros (Admins)**
// Ruta para gestionar los platos (solo accesible para camareros)
app.post('/admin/platos', checkRole('camarero'), (req, res) => {
  // Lógica para añadir, editar o eliminar platos
  res.status(200).json({ message: 'Plato añadido/actualizado/eliminado con éxito' });
});

// Ruta para gestionar las reservas (solo accesible para camareros)
app.post('/admin/reservas', checkRole('camarero'), (req, res) => {
  // Lógica para gestionar las reservas (modificar, eliminar)
  res.status(200).json({ message: 'Reserva gestionada con éxito' });
});

// Rutas para los **Clientes (Usuarios)**
// Ruta para que los usuarios (clientes) hagan reservas
app.post('/reservas', checkRole('cliente'), (req, res) => {
  // Lógica para crear una reserva (cliente realiza la reserva)
  res.status(200).json({ message: 'Reserva realizada con éxito' });
});


// Definimos una ruta básica (la raíz '/') que responde con un mensaje
app.get('/', (req, res) => {
    res.send('¡El servidor está en funcionamiento!');
});

// Iniciamos el servidor y le decimos que escuche en el puerto definido (3001 en este caso)
app.listen(PORT, () => {
    console.log(`El servidor está en funcionamiento en http://localhost:${PORT}`);
});
