'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AdminActivity', {
      idActivity: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      action: {
        allowNull: false,
        type: Sequelize.STRING
      },
      descActivity: {
        allowNull: true,
        type: Sequelize.STRING
      },
      idAdmin: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Admin',
          key: 'idAdmin'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AdminActivity');
  }
};
