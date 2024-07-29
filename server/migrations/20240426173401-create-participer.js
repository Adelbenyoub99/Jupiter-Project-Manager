'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Participation', {
      idParticipation : {
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
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Projet',
          key: 'idProjet'
        }
      },
      role: {
        type: Sequelize.ENUM('ChefProjet', 'Adjoint', 'Collaborateur'),
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Participation');
  }
};
