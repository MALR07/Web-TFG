const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión
const User = require('./users');
const Plato = require('./platos');

// Modelo para la tabla 'reservas'
const Reserva = sequelize.define('Reserva', {
  id_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_user',
    },
  },
  id_plato: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Plato,
      key: 'id_plato',
    },
  },
  fecha_reserva: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,  // Asegura que la cantidad sea al menos 1
    },
  },
}, {
  tableName: 'reservas',
  timestamps: false,
 // schema: 'logica',     // Especifica el esquema en el que se debe guardar la tabla
});

// Definir relaciones (relación entre reservas, usuarios y platos)
Reserva.belongsTo(User, { foreignKey: 'id_usuario', targetKey: 'id_user' });
Reserva.belongsTo(Plato, { foreignKey: 'id_plato', targetKey: 'id_plato' });

module.exports = Reserva;
