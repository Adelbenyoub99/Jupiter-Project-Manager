const { Projet, User, Participation, Tache, Assigner, DemandeAdhesion, Message, Dossier, Fichier ,Notification } = require('../models');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const process = require('process');
const logger = require('../utils/logger');
const participationController = require('./participerController')
const notificationController=require('./notificationController')
const cloudinaryController = require('./fichiersController')
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const { Op } = require('sequelize'); 
const adminActivityLogger=require('../middlewares/adminActivityLogger')
dotenv.config();


// crearion projet oui
const genererUrl = () => {
    const timestamp = Date.now().toString();
    const randomChars = Math.random().toString(36).substring(2, 8);
    return timestamp + randomChars;
};

exports.createProject = async (req, res) => {
    const { nomProjet, descProjet, dureeFormatted, delaiProjet, visibiliteProjet } = req.body;
    const idUtilisateur = req.user.userId; 
    const generatedUrl = genererUrl();
    console.log('idUtilisateur'+idUtilisateur)
    try {
      // Créer le projet
      const newProjet = await Projet.create({
        nomProjet,
        descProjet,
        dureeProjet: `${dureeFormatted.value} ${dureeFormatted.unit}`, // stockez la durée formatée
        visibiliteProjet,
        URL: generatedUrl,
        delaiProjet,
        idChefProjet: idUtilisateur,
      });
  
      // Creation d'une participation
      const participationData = {
        idUtilisateur: idUtilisateur,
        idProjet: newProjet.idProjet,
        role: 'ChefProjet'
      };
      console.log(participationData)
      await participationController.createParticipation(participationData);
     
      // Récupérer le projet avec les relations nécessaires
      const projetComplet = await Projet.findOne({
        where: { idProjet: newProjet.idProjet },
        include: [
          {
            model: User,
            as: 'Membres',
            attributes: ['idUtilisateur'],
            through: {
              model: Participation,
              as: 'Participations',
              attributes: ['role'],
              where: { idUtilisateur } // Filtre pour s'assurer que l'utilisateur est un membre
            }
          }
        ]
      });
  
      res.status(201).json(projetComplet);
  
      
     
      
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

// Get all projects oui
exports.getAllProjets = async (req, res) => {
    try {
        const projets = await Projet.findAll({
            include: {
                model: User,
                as: 'Chef',
                attributes: ['nomUtilisateur', 'image'] 
            }
        });
        res.status(200).json(projets);
    } catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get project by ID oui
exports.getProjetById = async (req, res) => {
    const { idProjet } = req.params;
    try {
        const projet = await Projet.findByPk(idProjet);

        
        if (!projet) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(projet);
    } catch (error) {
        console.error('Error getting project by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get project url oui
exports.getProjectUrl=async(req,res)=>{
    const { idProjet } = req.params;
    try {
        const projet = await Projet.scope('withURL').findByPk(idProjet);
        if (!projet) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ URL: projet.URL });
    } catch (error) {
        console.error('Error getting project URL:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// get project by URL ///
exports.getProjectByUrl = async (req, res) => {
    const userId = req.user.userId;
    const { url } = req.params;
    
    try {
        const project = await Projet.findOne({ 
            where: { URL: url },
            include: [
                {
                    model: User,
                    as: 'Membres',
                    through: {
                        model: Participation,
                        as: 'Participations',
                        attributes: ['role'],
                        where: { idUtilisateur : userId } 
                    }
                }
            ]
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Extrayez le rôle de la participation de l'utilisateur actuel
        const userRole = project.Membres[0].Participations.role;
        
        // Retournez le projet avec le rôle de l'utilisateur
        res.status(200).json({ project, userRole });
    } catch (error) {
        console.error('Error getting project by URL:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getByUrl = async (req, res) => {
    const { url } = req.params;
    
    try {
        const project = await Projet.findOne({ 
            where: { URL: url },
          
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ project});
    } catch (error) {
        console.error('Error getting project by URL:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get members of a project by project ID (non)
exports.getProjectMembers = async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const projet = await Projet.findByPk(projectId, {
            include: [{
                model: User,
                as: 'Membres', 
                through: {
                    model: Participation,
                    as: 'Participations' 
                }
            }]
        });

        if (!projet) {
            return res.status(404).json({ message: 'Project not found' });
        } 

        if (!projet.Membres) {
            console.error('No users associated with this project:', projet);
            return res.status(404).json({ message: 'Members not found' });
        }

        const members = projet.Membres.map(user => user);
        res.status(200).json(members);
    } catch (error) {
        console.error('Error getting project members:', error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};

// Get all projects with visibility 'Public' oui

exports.getPublicProjects = async (req, res) => {
    try {
        const publicProjects = await Projet.findAll({
            where: { visibiliteProjet: 'Public' },
            include: [
                {
                    model: User,
                    as: 'Membres',
                    attributes: [], 
                    through: {
                        model: Participation,
                        as: 'Participations',
                        attributes: []
                    }
                },
                {
                    model: User,
                    as: 'Chef', // Alias for project leader
                    attributes: ['nomUtilisateur','nom','prenom','email','numTel','image'], // Select the attributes you want to include, e.g., 'nom'
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn('COUNT', Sequelize.col('Membres.idUtilisateur')), 'membersCount']
                ]
            },
            group: ['Projet.idProjet', 'Chef.idUtilisateur'] 
        });

        // Modify the data structure to include the number of members and the project leader's name
        const projectsWithMembersCountAndChef = publicProjects.map(project => {
            return {
                ...project.get({ plain: true }),
                membersCount: project.get('membersCount'),
               
            };
        });

        res.status(200).json(projectsWithMembersCountAndChef);
    } catch (error) {
        console.error('Error getting public projects with members count and project leader:', error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};

exports.searchPublicProject =  async (req, res) => {
    try {
        const { search } = req.query;
        const normalizedSearch = search ? search.trim().toLowerCase().replace(/\s+/g, '') : '';
        console.log(normalizedSearch);

        const publicProjects = await Projet.findAll({
            where: {
                visibiliteProjet: 'Public',
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.fn('REPLACE', Sequelize.col('nomProjet'), ' ', '')),
                        { [Op.like]: `%${normalizedSearch}%` }
                    ),
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.fn('REPLACE', Sequelize.col('descProjet'), ' ', '')),
                        { [Op.like]: `%${normalizedSearch}%` }
                    )
                ]
            },
            include: [
                {
                    model: User,
                    as: 'Membres',
                    attributes: [],
                    through: {
                        model: Participation,
                        as: 'Participations',
                        attributes: []
                    }
                },
                {
                    model: User,
                    as: 'Chef',
                    attributes: ['nomUtilisateur', 'nom', 'prenom', 'email', 'numTel', 'image']
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn('COUNT', Sequelize.col('Membres.idUtilisateur')), 'membersCount']
                ]
            },
            group: ['Projet.idProjet', 'Chef.idUtilisateur']
        });

        const projectsWithMembersCountAndChef = publicProjects.map(project => {
            return {
                ...project.get({ plain: true }),
                membersCount: project.get('membersCount')
            };
        });

        res.status(200).json(projectsWithMembersCountAndChef);
    } catch (error) {
        console.error('Error getting public projects with members count and project leader:', error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};
// Update project by ID oui
exports.updateProjetById = async (req, res) => {
    const { idProjet } = req.params;
    const idUtilisateur = req.user.userId; // Récupération de l'ID utilisateur à partir du token
   
    try {
        const [updated] = await Projet.update(req.body, {
            where: { idProjet: idProjet }
        });
        if (updated) {
            const updatedProjet = await Projet.findByPk(idProjet);
            //creation de notification
            const participations = await Participation.findAll({
                where: { idProjet: idProjet },
                
            })
            const titreNotif = `Modification du projet`;
            const contenuNotif = `Le chef de projet a effectué une modification dans le projet ${updatedProjet.nomProjet}.`;

            for (const participation of participations) {
             
                if (participation.idUtilisateur !== idUtilisateur) {
                    const notificationData = {
                        titreNotif,
                        contenuNotif,
                        idUtilisateur: participation.idUtilisateur,
                        idProjet: idProjet
                    };

                    await notificationController.createNotif(notificationData);
                }
            }




            return res.status(200).json(updatedProjet);
        }
        throw new Error('Project not found');
    } catch (error) {
        console.error('Error updating project by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
///////////////get user public projects/////////////////////
exports.getUserPublicProject = async (req, res) => {
    const idUtilisateur = req.user.userId; // Récupération de l'ID utilisateur à partir du token

    try {
        const projetPublicUser = await Projet.findAll({
            where: {
                visibiliteProjet: 'Public', // Filtre les projets publics
                '$Membres.Participations.idUtilisateur$': idUtilisateur // Filtre pour s'assurer que l'utilisateur est un membre
            },
            include: [
                {
                    model: User,
                    as: 'Membres',
                    attributes: ['idUtilisateur'], // Inclure les attributs souhaités des membres
                    through: {
                        model: Participation,
                        as: 'Participations',
                        attributes: ['role'], // Inclure le rôle du membre
                        where: { idUtilisateur } // Filtre pour s'assurer que l'utilisateur est un membre
                    }
                }
            ]
        });


        if (!projetPublicUser || !projetPublicUser.length===0) {
            return res.status(200).json([]);
        }

        res.status(200).json(projetPublicUser);
    } catch (error) {
        console.error('Error getting public projects for user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

///////////////get user projects/////////////////////
exports.getUserProject = async (req, res) => {
    const idUtilisateur = req.user.userId; // Récupération de l'ID utilisateur à partir du token

    try {
        const projetUser = await Projet.findAll({
            where: {
                '$Membres.Participations.idUtilisateur$': idUtilisateur // Filtre pour s'assurer que l'utilisateur est un membre
            },
            include: [
                {
                    model: User,
                    as: 'Membres',
                    attributes: ['idUtilisateur'], // Inclure les attributs souhaités des membres
                    through: {
                        model: Participation,
                        as: 'Participations',
                        attributes: ['role'], // Inclure le rôle du membre
                        where: { idUtilisateur } // Filtre pour s'assurer que l'utilisateur est un membre
                    }
                }
            ]
        });

        if (!projetUser.length) {
            return res.status(200).json( []);
        }

        res.status(200).json(projetUser);
    } catch (error) {
        console.error('Error getting  projects for user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// Delete project by ID oui 
exports.deleteProjetById = async (req, res) => {
    const { idProjet } = req.params;
    const idUtilisateur = req.user.userId; // Récupération de l'ID utilisateur à partir du token
    try {
        // Check for tasks linked to the project
        const tasks = await Tache.findAll({ where: { idProjet: idProjet } });

        if (tasks.length > 0) {
            for (const task of tasks) {
                // Check for assignments linked to the task
                const assignments = await Assigner.findAll({ where: { idTache: task.idTache } });
                if (assignments.length > 0) {
                    // Delete assignments linked to the task
                    await Assigner.destroy({ where: { idTache: task.idTache } });
                }
                // Delete the task
                await Tache.destroy({ where: { idTache: task.idTache } });
            }
        }

        // Check for demandes d'adhesion linked to the project
        const demandesAdhesion = await DemandeAdhesion.findAll({ where: { idProjet: idProjet } });
        if (demandesAdhesion.length > 0) {
            // Delete demandes d'adhesion linked to the project
            await DemandeAdhesion.destroy({ where: { idProjet: idProjet } });
        }
       
        // Check for participations linked to the project
        const participations = await Participation.findAll({ where: { idProjet: idProjet } });
        if (participations.length > 0) {

            const projet=await Projet.findByPk(idProjet)
            const titreNotif = `Projet supprimé`;
            const contenuNotif = `Le projet ${projet.nomProjet} a été supprimé.`;

            for (const participation of participations) {
            
                    const notificationData = {
                        titreNotif,
                        contenuNotif,
                        idUtilisateur: participation.idUtilisateur,
                        idProjet: idProjet
                    };

                    await notificationController.createNotif(notificationData);
                
            }

            // Delete participations linked to the project
            await Participation.destroy({ where: { idProjet: idProjet } });
        }
        await Notification.update({ idProjet: null }, { where: { idProjet: idProjet } });
        // Check for messages linked to the project
        const messages = await Message.findAll({ where: { idProjet: idProjet } });
        if (messages.length > 0) {
            // Delete messages linked to the project
            await Message.destroy({ where: { idProjet: idProjet } });
        }

        const notifications = await Notification.findAll({ where: { idProjet: idProjet } });
        if (notifications.length > 0) {
            // Delete messages linked to the project
            await Notification.destroy({ where: { idProjet: idProjet } });
        }

        // Delete the project
        const deleted = await Projet.destroy({ where: { idProjet: idProjet } });
        if (deleted) {
            return res.status(200).json({message: "Projet supprimer"});
        }

        throw new Error('Project not found');
    } catch (error) {
        console.error('Error deleting project by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// admin delet project just tu create a new notfication

exports.deleteProjetByAdmin = async (req, res) => {
    const { idProjet } = req.params;
    
    try {
        // Check for tasks linked to the project
        const tasks = await Tache.findAll({ where: { idProjet: idProjet } });

        if (tasks.length > 0) {
            for (const task of tasks) {
                // Check for assignments linked to the task
                const assignments = await Assigner.findAll({ where: { idTache: task.idTache } });
                if (assignments.length > 0) {
                    // Delete assignments linked to the task
                    await Assigner.destroy({ where: { idTache: task.idTache } });
                }
                // Delete the task
                await Tache.destroy({ where: { idTache: task.idTache } });
            }
        }

        // Check for demandes d'adhesion linked to the project
        const demandesAdhesion = await DemandeAdhesion.findAll({ where: { idProjet: idProjet } });
        if (demandesAdhesion.length > 0) {
            // Delete demandes d'adhesion linked to the project
            await DemandeAdhesion.destroy({ where: { idProjet: idProjet } });
        }
      
        // Check for participations linked to the project
        const participations = await Participation.findAll({ where: { idProjet: idProjet } });
        if (participations.length > 0) {

            const projet=await Projet.findByPk(idProjet)
            const titreNotif = `Projet supprimé par un administrateur`;
            const contenuNotif = `Le projet ${projet.nomProjet} a été supprimé.`;

            for (const participation of participations) {
            
                    const notificationData = {
                        titreNotif,
                        contenuNotif,
                        idUtilisateur: participation.idUtilisateur,
                        idProjet: idProjet
                    };

                    await notificationController.createNotif(notificationData);
                
            }
              // Enregistrer l'activité  d'administrateur
            const action = 'Suppression d\'un projet';
            const descActivity = `Le projet ${projet.nomProjet} est supprimé `;
            const idAdmin = req.adminId;
            await adminActivityLogger(action, descActivity, idAdmin);
            // Delete participations linked to the project
            await Participation.destroy({ where: { idProjet: idProjet } });
        }
        await Notification.update({ idProjet: null }, { where: { idProjet: idProjet } });
        // Check for messages linked to the project
        const messages = await Message.findAll({ where: { idProjet: idProjet } });
        if (messages.length > 0) {
            // Delete messages linked to the project
            await Message.destroy({ where: { idProjet: idProjet } });
        }
        const notifications = await Notification.findAll({ where: { idProjet: idProjet } });
        if (notifications.length > 0) {
            // Delete messages linked to the project
            await Notification.destroy({ where: { idProjet: idProjet } });
        }

       const fichiers=await Fichier.findAll({where :{idProjet:idProjet}})
       if(fichiers.length>0){
        await Fichier.destroy({where:{ idProjet: idProjet }})
       }

        // Delete the project
        const deleted = await Projet.destroy({ where: { idProjet: idProjet } });
        if (deleted) {
            return res.status(200).json({message: "Projet supprimer"});
        }

        throw new Error('Project not found');
    } catch (error) {
        console.error('Error deleting project by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.searchProject = async (req, res) => {
    try {
        const { search } = req.query;
        const normalizedSearch = search ? search.trim().toLowerCase().replace(/\s+/g, '') : '';
        console.log('Normalized search:', normalizedSearch);

        // Perform the search query
        const projectsWithMembersCountAndChef = await Projet.findAll({
            where: {
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.fn('REPLACE', Sequelize.col('nomProjet'), ' ', '')),
                        { [Op.like]: `%${normalizedSearch}%` }
                    ),
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.fn('REPLACE', Sequelize.col('descProjet'), ' ', '')),
                        { [Op.like]: `%${normalizedSearch}%` }
                    )
                ]
            },
            include: {
                model: User,
                as: 'Chef',
                attributes: ['nomUtilisateur', 'image']
            }
           
        });

        res.status(200).json(projectsWithMembersCountAndChef);
    } catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};