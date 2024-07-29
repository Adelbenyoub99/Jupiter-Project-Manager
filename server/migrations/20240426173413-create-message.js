'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Message', {
      idMsg: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      contenuMsg: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateEnvoi: {
        type: Sequelize.DATE,
        allowNull: false
      },
      idProjet:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Projet',
          key: 'idProjet'
        }
      },
      idUtilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'idUtilisateur'
        }},
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Message');
  }
};
