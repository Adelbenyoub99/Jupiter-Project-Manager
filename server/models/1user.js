const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Projet = require('./projet');
const Participation = require('./participation')
const Tache= require('./tache')
const Fichier=require('./fichier')
const Assigner =require('./assigner')
const Message = require('./message')
const DemandeAdhesion = require('./demandeAdhesion')
const Signal = require('./signal')
const Notification = require('./notification')
const User = sequelize.define('User', {
  idUtilisateur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomUtilisateur: {
    type: DataTypes.STRING,
    allowNull: false
  },
  motDePasse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateNaissance: {
    type: DataTypes.DATE,
    allowNull: true
  },
  numTel: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  descProfile:{
  type: DataTypes.STRING,
  allowNull: true
  },
  image: {
    type: DataTypes.STRING
  },
  isActive:{
    type:DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'User',
  timestamps: true
});

// Définir les relations/////////////////////////////
//////////// 1 user crée ou partager plusiers projets////////////////////////
User.hasMany(Projet, { foreignKey: 'idChefProjet' , as: 'ChefDeProjets'}); 
Projet.belongsTo(User, { foreignKey: 'idChefProjet',as: 'Chef' }); 
////////////// 1 user partage plusieur fichiers /////////////////
User.hasMany(Fichier,{foreignKey:'idUtilisateur'});
Fichier.belongsTo(User,{foreignKey:'idUtilisateur'})
////////////// 1 user envoie plusieur Messages /////////////////
User.hasMany(Message,{foreignKey:'idUtilisateur'});
Message.belongsTo(User,{foreignKey:'idUtilisateur'})
////////////////1 user signal plusieur signalement//////////
User.hasMany(Signal,{foreignKey :'idUtilisateur'})
Signal.belongsTo(User,{foreignKey:'idUtilisateur'})

////////////// 1 user a plusieur Notifications /////////////////
User.hasMany(Notification,{foreignKey:'idUtilisateur'});
Notification.belongsTo(User,{foreignKey:'idUtilisateur'})
Projet.hasMany(Notification,{foreignKey:'idProjet'});
Notification.belongsTo(Projet,{foreignKey:'idProjet'});
/////Associations many to many////////////////////////
/////////////Plusieur users a plusieur Projects/////////

User.belongsToMany(Projet, { through: Participation, foreignKey: 'idUtilisateur' ,as:'Membres'});
Projet.belongsToMany(User, { through: Participation, foreignKey: 'idProjet' ,as:'Membres'});
User.hasMany(Participation,{foreignKey:"idUtilisateur"})
Participation.belongsTo(User,{foreignKey:"idUtilisateur"})
Projet.hasMany(Participation,{foreignKey:"idProjet"})
Participation.belongsTo(Projet,{foreignKey:"idProjet"})
/////////////Plusieur users a plusieur taches/////////
User.belongsToMany(Tache,{through : Assigner , foreignKey: 'idUtilisateur'})
Tache.belongsToMany(User, {through : Assigner , foreignKey: 'idTache' })
User.hasMany(Assigner, { foreignKey: 'idUtilisateur' });
Assigner.belongsTo(User, { foreignKey: 'idUtilisateur' });

Tache.hasMany(Assigner, { foreignKey: 'idTache' });
Assigner.belongsTo(Tache, { foreignKey: 'idTache' });
///////////Plusieur users peut demander plusieur Projets///////////
User.belongsToMany(Projet, {through :DemandeAdhesion , foreignKey: 'idUtilisateur',as:'demandeurs'})
Projet.belongsToMany(User,{through: DemandeAdhesion, foreignKey: 'idProjet',as:'demandeurs'})
DemandeAdhesion.belongsTo(User ,{foreignKey:'idUtilisateur'})
User.hasMany(DemandeAdhesion,{foreignKey:'idUtilisateur'})

/////////////chemin complet de l'image de profil////////////////
User.prototype.getImageUrl = function() {
  return `/uploadsIMG/${this.image}`;
};


module.exports = User;