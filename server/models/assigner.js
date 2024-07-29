const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assigner = sequelize.define('Assigner', {
  idUtilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'User',
      key: 'idUtilisateur'
    }
  },
  idTache: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Tache',
      key: 'idTache'
    }
  }
}, {
  tableName: 'Assigner',
  timestamps: true
});

module.exports = Assigner;
