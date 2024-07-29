'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('DemandeAdhesion', {
      idDemande: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      idUtilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'User',
          key: 'idUtilisateur'
        }
      },
      idProjet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Projet',
          key: 'idProjet'
        }
      },
      etatDemande: {
        type: Sequelize.ENUM('En cours','Acceptée', 'Refusée','Annulée'),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      }
    });
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('DemandeAdhesion');
  }
  
};
