const bcrypt = require('bcryptjs'); // Importar bcrypt para la comparación de contraseñas
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión

// Modelo para la tabla 'users'
const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['cliente', 'camarero']],
    },
  },
}, {
  tableName: 'users',  // Especifica el nombre de la tabla en la base de datos
  timestamps: false,    // Deshabilitamos los campos 'createdAt' y 'updatedAt'
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
