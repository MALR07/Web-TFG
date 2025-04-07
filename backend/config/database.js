require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env
const { Sequelize } = require('sequelize');

// Crear una nueva instancia de Sequelize para conectar con PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,       // Nombre de la base de datos
  process.env.DB_USER,       // Usuario de la base de datos
  process.env.DB_PASSWORD,   // Contraseña del usuario
  {
    host: process.env.DB_HOST || 'WEB-TFG-db',  // Dirección del servidor de PostgreSQL
    port: process.env.DB_PORT || 5432,         // Puerto de PostgreSQL
    dialect: 'postgres',      // Usamos PostgreSQL
    logging: false,           // Opcional: desactivar las consultas SQL en consola
    pool: {
      max: 5,                 // Número máximo de conexiones
      min: 0,                 // Número mínimo de conexiones
      acquire: 30000,         // Tiempo máximo para obtener una conexión antes de lanzar un error
      idle: 10000             // Tiempo máximo para que una conexión esté inactiva antes de liberarla
    }
  }
);

// Verificar que la conexión se haya realizado correctamente
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa!');
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });

module.exports = sequelize; // Exportamos la instancia de Sequelize para usarla en otros archivos
