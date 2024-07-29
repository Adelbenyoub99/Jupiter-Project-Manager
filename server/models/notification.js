const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User , Projet } = require('./1user');

const Notification = sequelize.define('Notification', {
  idNotif: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titreNotif: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contenuNotif: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idUtilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: User,
      key: 'idUtilisateur'
    }
  },
  idProjet: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    references: {
      model: Projet,
      key: 'idProjet'
    },
    onDelete: 'SET NULL'
  }

}, {
  tableName: 'Notification',
  timestamps: true
});

module.exports = Notification;
