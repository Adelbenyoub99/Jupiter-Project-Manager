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
    },
    onDelete: 'CASCADE'
  },
  idTache: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Tache',
      key: 'idTache'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'Assigner',
  timestamps: true
});

module.exports = Assigner;
