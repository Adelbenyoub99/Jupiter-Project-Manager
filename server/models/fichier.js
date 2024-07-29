const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const {Projet} = require('./projet')


    const Fichier = sequelize.define('Fichier', {
        idFichier: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
      idProjet: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Projet,
            key: 'idProjet'
          }
      },
      idUtilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'idUtilisateur'
          }
      },
      nomFichier: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publicId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      folder: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
        tableName: 'Fichier',
        timestamps: true
      });

  
   module.exports=Fichier;

  