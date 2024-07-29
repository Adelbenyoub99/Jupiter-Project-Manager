const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./1user');
const Messages = require('./message');
const Tache = require('./tache');
const Fichier=require('./fichier')

const Projet = sequelize.define('Projet', {
  idProjet: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomProjet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descProjet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dureeProjet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  visibiliteProjet: {
    type: DataTypes.ENUM('Public', 'Prive'),
    allowNull: false
  },
  URL: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
  delaiProjet: { 
    type: DataTypes.DATE,
    allowNull: true
  },
  idChefProjet: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: User,
      key: 'idUtilisateur'
    }
  }
}, {
  tableName: 'Projet',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['URL'] }
  },
  scopes: {
    withURL: {
      attributes: { include: ['URL'] }
    }
  }
});
/////Associations/////////////////
//////////un projet a plusieurs messages //////////
Projet.hasMany(Messages,{foreignKey:'idProjet'})
Messages.belongsTo(Projet,{foreignKey:'idProjet'})
///////////un projet a plusieur taches ////////////
Projet.hasMany(Tache,{foreignKey :'idProjet'})
Tache.belongsTo(Projet,{foreignKey :'idProjet'})
/////////////un projet a pluisieurs fichiers/////////
Projet.hasMany(Fichier,{foreignKey:'idProjet'})
Fichier.belongsTo(Projet,{foreignKey :'idProjet'})

module.exports = Projet;
