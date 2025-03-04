"use strict";
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {  
  class Persona extends Model {}

  Persona.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      interests: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        validate: {
          min: -90,
          max: 90
        },
        get() {
          const value = this.getDataValue('latitude');
          return value === null ? null : Number.parseFloat(value);
        },
      },
      longitude: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        validate: {
          min: -180,
          max: 180
        },
        get() {
          const value = this.getDataValue('longitude');
          return value === null ? null : Number.parseFloat(value);
        },
      }
    },
    {
      // Model options
      sequelize,
      tableName: 'personas', 
      timestamps: true, // Enables createdAt and updatedAt fields
      underscored: true // Uses camelCase for column names; set true for snake_case
    }
  );

  return Persona;
}
