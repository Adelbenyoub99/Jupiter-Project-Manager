const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('jupiter_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', 
  define: {
    timestamps: true // Si vous ne souhaitez pas que Sequelize gère les champs createdAt et updatedAt
  }
});

// Test de la connexion à la base de données

(async () => {
  try {
    console.log('Tentative de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }
})();

module.exports = sequelize;
/*
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  // Options de sécurité supplémentaires
  insecureAuth: false,
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: true
});

module.exports = pool.promise();*/
