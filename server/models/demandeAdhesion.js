const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Projet } = require('./projet');
const { User } = require('./user');

const DemandeAdhesion = sequelize.define('DemandeAdhesion', {
  idDemande: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,

  },
  idUtilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: User,
      key: 'idUtilisateur'
    },
    onDelete: 'CASCADE'
  },
  idProjet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Projet,
      key: 'idProjet'
    },
    onDelete: 'CASCADE'
  },
  etatDemande: {
    type: DataTypes.ENUM('En cours','Acceptée', 'Refusée','Annulée'),
    allowNull: false,
    defaultValue:'En cours'
  }
}, {
  tableName: 'DemandeAdhesion',
  timestamps: true
});
  

module.exports = DemandeAdhesion;
