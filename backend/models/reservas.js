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
     type: DataTypes.DATE, // En lugar de DATE, usa `DataTypes.DATE` o `DataTypes.DATEONLY` según corresponda
      allowNull: false,
      get() {
        // Obtener la fecha, asegurar que la zona horaria es UTC
        const value = this.getDataValue('fecha_reserva');
        // Devuelvo el valor como UTC
        return value ? new Date(value).toISOString() : null;
      },
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
