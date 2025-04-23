module.exports = (sequelize, DataTypes) => {
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
        model: 'users',
        key: 'id_user',
      },
    },
    id_plato: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'platos',
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
        min: 1,
      },
    },
  }, {
    tableName: 'reservas',
    timestamps: false,
  });

  Reserva.associate = (models) => {
    Reserva.belongsTo(models.User, { foreignKey: 'id_usuario', targetKey: 'id_user' });
    Reserva.belongsTo(models.Plato, { foreignKey: 'id_plato', targetKey: 'id_plato' });
  };

  return Reserva;
};
