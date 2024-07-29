'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notification', {
      idNotif: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      titreNotif: {
        type: Sequelize.STRING, // Utilisez Sequelize.STRING au lieu de DataTypes.STRING
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
          model: 'User',
          key: 'idUtilisateur'
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
    await queryInterface.dropTable('Notification');
  }
};
