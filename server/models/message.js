const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./1user');
const {Projet} = require('./projet')

const Message = sequelize.define('Message', {
  idMsg: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contenuMsg: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateEnvoi: {
    type: DataTypes.DATE,
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
  tableName: 'Message',
  timestamps: true
});

module.exports = Message;
