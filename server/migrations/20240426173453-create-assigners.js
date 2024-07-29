'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Assigner', {
      idUtilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'User',
          key: 'idUtilisateur'
        }
      },
      idTache: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Tache',
          key: 'idTache'
        }
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
    await queryInterface.dropTable('Assigner');
  }
  
};
