'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('Admin', {
        idAdmin: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nomAdmin: {
          type: Sequelize.STRING,
          allowNull: false
        },
        motDePasse: {
          type: Sequelize.STRING,
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

      await queryInterface.dropTable('Admin');
    
  }
};
