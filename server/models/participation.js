const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Projet } = require('./projet');
const { User } = require('./1user');

const Participation = sequelize.define('Participation', {
    idParticipation : {
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
    }
  },
  idProjet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Projet,
      key: 'idProjet'
    }
  },
  role: {
    type: DataTypes.ENUM('ChefProjet', 'Adjoint', 'Collaborateur'),
    allowNull: false
  }
}, {
  tableName: 'Participation',
  timestamps: true
});

module.exports = Participation;
