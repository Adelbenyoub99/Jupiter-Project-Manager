'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tache', {
      idTache: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nomTache: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descTache: {
        type: Sequelize.STRING,
        allowNull: false
      },
      statutTache: {
        type: Sequelize.ENUM('En attente', 'En cours', 'Terminé'),
        allowNull: false
      },
      dureeTache: {
        type: Sequelize.STRING,
        allowNull: true
      },
      priorite: {
        type: Sequelize.ENUM('Eleve', 'Moyenne', 'Basse'),
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
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tache');
  }
};
