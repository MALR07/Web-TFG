// Importamos los módulos necesarios
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');  
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database'); // Importamos la instancia de Sequelize configurada en 'database.js

// Importamos los modelos (User, Plato y Reserva) para usarlos y realizar sincronización
const User = require('./models/users');
const Plato = require('./models/platos');
const Reserva = require('./models/reservas');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Creamos una instancia de la aplicación Express, que será nuestro servidor
const app = express();

// Definimos el puerto en el que el servidor va a escuchar
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());  // Habilitar CORS
app.use(express.json()); // Este middleware permite que el servidor entienda y procese datos en formato JSON
app.use(express.urlencoded({ extended: true }));  // Analizar cuerpos de solicitudes URL-encoded

// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',  // Secreto para firmar la sesión
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Configura 'secure: true' si usas HTTPS
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
// Esto se asegura de que las tablas en la base de datos estén sincronizadas con nuestros modelos Sequelize
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

// Ruta de registro (esto depende de si decides implementarla)
app.post('/register', async (req, res) => {
  const { nombre, email, contrasena, rol } = req.body;

  try {
    // Crear un nuevo usuario
    const user = await User.create({
      nombre,
      email,
      contrasena,  // Asegúrate de encriptar la contraseña antes de guardarla
      rol
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
    return res.redirect('/login');
  }
  res.send('Bienvenido al dashboard');
});

// Definimos una ruta básica (la raíz '/') que responde con un mensaje
app.get('/', (req, res) => {
    res.send('¡El servidor está en funcionamiento!');
});

// Iniciamos el servidor y le decimos que escuche en el puerto definido (3001 en este caso)
// Cuando el servidor esté en funcionamiento, se ejecutará esta función y mostrará el mensaje en consola
app.listen(PORT, () => {
    console.log(`El servidor está en funcionamiento en http://localhost:${PORT}`);
});

