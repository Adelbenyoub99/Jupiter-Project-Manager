const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  idAdmin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomAdmin: {
    type: DataTypes.STRING,
    allowNull: false
  },
  motDePasse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isSuperAdmin:{
    type : DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Admin',
  timestamps: true 
});

module.exports = Admin;
