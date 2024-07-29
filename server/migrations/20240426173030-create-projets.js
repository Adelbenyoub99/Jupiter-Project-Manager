'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projet', {
      idProjet: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nomProjet: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descProjet: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dureeProjet: {
        type: Sequelize.STRING,
        allowNull: true
      },
      visibiliteProjet: {
        type: Sequelize.ENUM('Public', 'Prive'),
        allowNull: false
      },
      URL: {
        type: Sequelize.STRING,
        allowNull: false
      },
      idChefProjet: {
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
    await queryInterface.dropTable('Projet');
  }
};
