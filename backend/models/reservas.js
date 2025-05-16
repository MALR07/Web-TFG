module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define('Reservas', {
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
    estado: {
      type: DataTypes.ENUM('confirmada', 'presentado', 'expirada'),
      defaultValue: 'confirmada',
      allowNull: false
    },
  }, {
    tableName: 'reservas',
    timestamps: false,
  });

  Reserva.associate = (models) => {
    // Relación con el modelo 'User' (clientes que hacen las reservas)
    Reserva.belongsTo(models.User, { foreignKey: 'id_usuario', targetKey: 'id_user' });

    // Relación con el modelo 'Plato' (el plato reservado)
    Reserva.belongsTo(models.Platos, { foreignKey: 'id_plato', targetKey: 'id_plato' });
  };

  return Reserva;
};
