'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Leer todos los archivos de la carpeta de modelos
fs
  .readdirSync(__dirname)
  .filter(file => {
    // Asegurarse de que el archivo no es el propio index.js y que es un archivo JavaScript
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const modelModule = require(path.join(__dirname, file));

    // Verificar si el modelo es una función (estilo sequelize.define)
    if (typeof modelModule === 'function') {
      const model = modelModule(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    } 
    // Verificar si el modelo es una clase (estilo Sequelize.Model)
    else if (modelModule.prototype instanceof Sequelize.Model) {
      const model = modelModule;  // Aquí no es necesario llamar a init() manualmente
      db[model.name] = model;
    } else {
      throw new Error(`El modelo en ${file} no es válido.`);
    }
  });

// Asocia los modelos si tienen un método 'associate'
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Añadir la instancia sequelize y Sequelize al objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
