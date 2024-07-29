'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Fichier', {
      idFichier: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      idProjet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projet', // Adjust the table name if necessary
          key: 'idProjet'
        },
      
      },
      idUtilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User', // Adjust the table name if necessary
          key: 'idUtilisateur'
        },
      
      },
      nomFichier: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      publicId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      folder: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Fichier');
  }
};
