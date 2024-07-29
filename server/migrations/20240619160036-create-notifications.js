'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notification', {
      idNotif: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      titreNotif: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contenuNotif: {
        type: Sequelize.STRING,
        allowNull: false
      },
      idUtilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',  // Assurez-vous que le nom de la table correspond au modèle User
          key: 'idUtilisateur'
        },
      },
      idProjet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projet',  // Assurez-vous que le nom de la table correspond au modèle Projet
          key: 'idProjet'
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Notification');
  }
};
