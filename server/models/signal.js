const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./1user');

const Signal = sequelize.define('Signal', {
  idSignal: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descSignal: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reponse: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  idUtilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'idUtilisateur'
  }},
  nomProjet: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nomUtilisateur: {
    type: DataTypes.STRING,
    allowNull: true
  },
  typeSignal: {
    type: DataTypes.ENUM,
    values: ['probleme_technique', 'probleme_user', 'probleme_projet'],
    allowNull: false
  }
}, {
  tableName: 'Signal',
  timestamps: true
});

module.exports = Signal;
