module.exports = (sequelize, DataTypes) => {
  const Comentario = sequelize.define('Comentario', {
    id_comentario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El comentario no puede estar vacío' },
        len: [1, 500],
      },
    },
    puntuacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'La puntuación debe ser un número entero' },
        min: 1,
        max: 5,
      },
    },
    fecha_comentario: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'comentarios',
    timestamps: false,
  });

  Comentario.associate = (models) => {
    Comentario.belongsTo(models.User, { foreignKey: 'id_user', targetKey: 'id_user' });
    Comentario.belongsTo(models.Plato, { foreignKey: 'id_plato', targetKey: 'id_plato' });
  };

  return Comentario;
};
