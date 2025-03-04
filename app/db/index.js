'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const db = {};

const config = require('../config');

// connect
const sequelize = new Sequelize(
    config.db.database,
    config.db.username, 
    config.db.password, 
    {
      dialect: 'postgres',
      host: config.db.host
    });

const modelPath = path.join(__dirname, '/models');
fs.readdirSync(modelPath)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.includes('.test.js') === false
    );
  })
  .forEach(file => {
    const model = require(path.join(modelPath, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
