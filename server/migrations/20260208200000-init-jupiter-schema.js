'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. User
    await queryInterface.createTable('User', {
      idUtilisateur: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nomUtilisateur: {
        type: Sequelize.STRING,
        allowNull: false
      },
      motDePasse: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateNaissance: {
        type: Sequelize.DATE,
        allowNull: true
      },
      numTel: {
        type: Sequelize.STRING,
        allowNull: true
      },
      descProfile: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    // 2. Admin
    await queryInterface.createTable('Admin', {
      idAdmin: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nomAdmin: {
        type: Sequelize.STRING,
        allowNull: false
      },
      motDePasse: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isSuperAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    // 3. Projet
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
        allowNull: false
      },
      visibiliteProjet: {
        type: Sequelize.ENUM('Public', 'Prive'),
        allowNull: false
      },
      URL: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      delaiProjet: {
        type: Sequelize.DATE,
        allowNull: true
      },
      idChefProjet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'idUtilisateur'
        },
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

    // 4. AdminActivities
    await queryInterface.createTable('Adminactivities', {
      idActivity: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descActivity: {
        type: Sequelize.STRING,
        allowNull: true
      },
      idAdmin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Admin',
          key: 'idAdmin'
        },
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

    // 5. Participation
    await queryInterface.createTable('Participation', {
      idParticipation: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      idUtilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'idUtilisateur'
        },
        onDelete: 'CASCADE'
      },
      idProjet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projet',
          key: 'idProjet'
        },
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.ENUM('ChefProjet', 'Adjoint', 'Collaborateur'),
        allowNull: false
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

    // 6. Tache
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
        allowNull: true
      },
      statutTache: {
        type: Sequelize.ENUM('En attente', 'En cours', 'Terminé'),
        allowNull: false,
        defaultValue: 'En attente'
      },
      dateDebut: {
        type: Sequelize.DATE,
        allowNull: true
      },
      dateFin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      priorite: {
        type: Sequelize.ENUM('Eleve', 'Moyenne', 'Basse'),
        allowNull: true
      },
      idProjet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projet',
          key: 'idProjet'
        },
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

    // 7. Assigner
    await queryInterface.createTable('Assigner', {
      idUtilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'User',
          key: 'idUtilisateur'
        },
        onDelete: 'CASCADE'
      },
      idTache: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Tache',
          key: 'idTache'
        },
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

    // 8. DemandeAdhesion
    await queryInterface.createTable('DemandeAdhesion', {
      idDemande: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      idUtilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'idUtilisateur'
        },
        onDelete: 'CASCADE'
      },
      idProjet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projet',
          key: 'idProjet'
        },
        onDelete: 'CASCADE'
      },
      etatDemande: {
        type: Sequelize.ENUM('En cours', 'Acceptée', 'Refusée', 'Annulée'),
        allowNull: false,
        defaultValue: 'En cours'
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

    // 9. Message
    await queryInterface.createTable('Message', {
      idMsg: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      contenuMsg: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateEnvoi: {
        type: Sequelize.DATE,
        allowNull: false
      },
      idUtilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'idUtilisateur'
        },
        onDelete: 'CASCADE'
      },
      idProjet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projet',
          key: 'idProjet'
        },
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

    // 10. Notification
    await queryInterface.createTable('Notification', {
      idNotif: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      titreNotif: {
        type: Sequelize.STRING,
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
        },
        onDelete: 'CASCADE'
      },
      idProjet: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Projet',
          key: 'idProjet'
        },
        onDelete: 'SET NULL'
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

    // 11. Signal
    await queryInterface.createTable('Signal', {
      idSignal: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      descSignal: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reponse: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      idUtilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'idUtilisateur'
        },
        onDelete: 'CASCADE'
      },
      nomProjet: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nomUtilisateur: {
        type: Sequelize.STRING,
        allowNull: true
      },
      typeSignal: {
        type: Sequelize.ENUM('probleme_technique', 'probleme_user', 'probleme_projet'),
        allowNull: false
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

    // 12. Fichier (Updated for MinIO)
    await queryInterface.createTable('Fichier', {
      idFichier: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      idProjet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projet',
          key: 'idProjet'
        },
        onDelete: 'CASCADE'
      },
      idUtilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'idUtilisateur'
        },
        onDelete: 'CASCADE'
      },
      nomFichier: {
        type: Sequelize.STRING,
        allowNull: false
      },
      publicId: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Object Key in MinIO'
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      Type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      folder: {
        type: Sequelize.STRING,
        allowNull: true
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

  async down(queryInterface, Sequelize) {
    // Drop in reverse order
    await queryInterface.dropTable('Fichier');
    await queryInterface.dropTable('Signal');
    await queryInterface.dropTable('Notification');
    await queryInterface.dropTable('Message');
    await queryInterface.dropTable('DemandeAdhesion');
    await queryInterface.dropTable('Assigner');
    await queryInterface.dropTable('Tache');
    await queryInterface.dropTable('Participation');
    await queryInterface.dropTable('Adminactivities');
    await queryInterface.dropTable('Projet');
    await queryInterface.dropTable('Admin');
    await queryInterface.dropTable('User');
  }
};
