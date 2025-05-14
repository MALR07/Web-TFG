module.exports = (sequelize, DataTypes) => {
  const Plato = sequelize.define('Platos', {
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
      allowNull: true,
    },

    imagen: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    
    cantidad_disponible: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  }, {
    tableName: 'platos',
    timestamps: false,
  });

  return Plato;
};