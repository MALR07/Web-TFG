// models/comentarios.js

module.exports = (sequelize, DataTypes) => {
    const Comentario = sequelize.define('Comentario', {
      id_comentario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      comentario: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      puntuacion: {
        type: DataTypes.INTEGER, // Puedes agregar puntuación si lo deseas
        allowNull: false
      },
    });
  
    Comentario.associate = (models) => {
      // Relación con el modelo de Usuario (quién dejó el comentario)
      Comentario.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'user'
      });
  
      // Relación con el modelo de Plato (a qué plato pertenece el comentario)
      Comentario.belongsTo(models.Plato, {
        foreignKey: 'id_plato',
        as: 'plato'
      });
    };
  
    return Comentario;