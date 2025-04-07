const bcrypt = require('bcryptjs'); // Importar bcrypt para la comparación de contraseñas
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión

// Modelo para la tabla 'users'
const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false, // Asegura que no sea nulo
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false, // Nombre no puede ser nulo
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false, // Email no puede ser nulo
    unique: true, // El correo debe ser único
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false, // La contraseña no puede ser nula
  },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false, // El rol no puede ser nulo
    validate: {
      isIn: [['cliente', 'camarero']], // Solo 'cliente' o 'camarero' son válidos
    },
  },
}, {
  tableName: 'users',  // Especifica el nombre de la tabla en la base de datos
  timestamps: false,    // Deshabilitamos los campos 'createdAt' y 'updatedAt'
  //schema: 'logica',     // Especifica el esquema en el que se debe guardar la tabla
});

// Hook para encriptar la contraseña antes de guardar
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.contrasena = await bcrypt.hash(user.contrasena, salt);
  });
  
  // Método para comparar contraseñas
  User.prototype.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.contrasena);
  };
  
module.exports = User;
