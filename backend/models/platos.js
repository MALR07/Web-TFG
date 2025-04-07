const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión

// Modelo para la tabla 'platos'
const Plato = sequelize.define('Plato', {
  id_plato: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true, // Permitimos que sea opcional
  },
  cantidad_disponible: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,  // Asegura que la cantidad disponible sea mayor o igual a 0
    },
  },
}, {
  tableName: 'platos',
  timestamps: false,
 // schema: 'logica',     // Especifica el esquema en el que se debe guardar la tabla
});

module.exports = Plato;
