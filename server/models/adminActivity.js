const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Admin = require('./admin');

const AdminActivity = sequelize.define('AdminActivity', {
    idActivity: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descActivity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    idAdmin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Admin, // Utilisation du modèle Admin pour la référence
            key: 'idAdmin'
        }
    },
   }, {
    tableName: 'Adminactivities',
    timestamps: true
  }
    
);

// Définir l'association entre Admin et AdminActivity
AdminActivity.belongsTo(Admin, { foreignKey: 'idAdmin' }); // Une activité appartient à un admin
Admin.hasMany(AdminActivity, { foreignKey: 'idAdmin' }); // Un admin a plusieurs activités

module.exports = AdminActivity;
