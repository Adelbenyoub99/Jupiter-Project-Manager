const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const {Projet} = require('./projet')
const Tache = sequelize.define('Tache', {
  idTache: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomTache: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descTache: {
    type: DataTypes.STRING,
    allowNull: true
  },
  statutTache: {
    type: DataTypes.ENUM('En attente', 'En cours', 'Terminé'),
    allowNull: false,
    defaultValue: 'En attente'
  },
 dateDebut:{
  type : DataTypes.DATE,
  allowNull: true
 },
 dateFin:{
  type : DataTypes.DATE,
  allowNull: true
 },
  priorite: {
    type: DataTypes.ENUM('Eleve', 'Moyenne', 'Basse'),
    allowNull: true
  },
  idProjet:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: Projet,
      key: 'idProjet'
    }
  },
}, {
  tableName: 'Tache',
  timestamps: true
});

module.exports = Tache;

