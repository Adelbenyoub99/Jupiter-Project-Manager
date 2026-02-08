'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedUserPassword = await bcrypt.hash('ùser@del123', 10);

    // Seed Admins
    await queryInterface.bulkInsert('Admin', [{
      nomAdmin: 'admin',
      motDePasse: hashedAdminPassword,
      isSuperAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Seed Users
    await queryInterface.bulkInsert('User', [{
      nomUtilisateur: 'johndoe',
      motDePasse: hashedUserPassword,
      email: 'adel.jupiter@gmail.com',
      nom: 'Doe',
      prenom: 'John',
      dateNaissance: new Date('1990-01-01'),
      numTel: '0123456789',
      image: 'JupiterIcon.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Get the seeded user id
    const [users] = await queryInterface.sequelize.query(
      `SELECT "idUtilisateur" from "User" WHERE email = 'adel.jupiter@gmail.com';`
    );

    const userId = users[0].idUtilisateur;

    // Seed Projects
    await queryInterface.bulkInsert('Projet', [{
      nomProjet: 'Projet de Test JUPITER',
      descProjet: 'Un projet de démonstration pour tester les fonctionnalités de JUPITER.',
      dureeProjet: '3 mois',
      visibiliteProjet: 'Public',
      URL: 'projet-demo-123',
      delaiProjet: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
      idChefProjet: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    const [projects] = await queryInterface.sequelize.query(
      `SELECT "idProjet" from "Projet" WHERE "nomProjet" = 'Projet de Test JUPITER';`
    );
    const projectId = projects[0].idProjet;

    // Seed Tasks
    await queryInterface.bulkInsert('Tache', [{
      nomTache: 'Configurer Docker',
      descTache: 'Mettre en place l\'orchestration Docker pour le projet.',
      statutTache: 'En cours',
      priorite: 'Eleve',
      dateDebut: new Date(),
      dateFin: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      idProjet: projectId,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tache', null, {});
    await queryInterface.bulkDelete('Projet', null, {});
    await queryInterface.bulkDelete('User', null, {});
    await queryInterface.bulkDelete('Admin', null, {});
  }
};
