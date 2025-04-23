// Modularización del servidor
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('./config/passport');
const sequelize = require('./config/database');
const routes = require('./routes'); // Importar rutas modularizadas
const models = require('./models'); // Importar modelos desde el archivo index.js

// Cargar variables de entorno
dotenv.config();

// Crear una instancia de la aplicación Express
const app = express();

// Definir el puerto
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Manejo de errores para excepciones no capturadas
process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err);
  process.exit(1);
});

// Verificar conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa!');
    // Sincronizar modelos
    models.sequelize.sync({ alter: false }) // Cambiar a { force: true } para eliminar y recrear tablas
      .then(() => console.log('Las tablas están sincronizadas correctamente.'))
      .catch((error) => console.error('Error al sincronizar las tablas:', error));
  })
  .catch((error) => console.error('No se pudo conectar a la base de datos:', error));

// Usar rutas modularizadas
app.use('/', routes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`El servidor está en funcionamiento en http://localhost:${PORT}`);
});
