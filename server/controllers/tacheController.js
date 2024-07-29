const { where } = require('sequelize');
const { Tache, Assigner, User,Projet,Notification } = require('../models');
const moment = require('moment');
const notificationControlller=require('./notificationController')
// Create a new task
exports.createTache = async (req, res) => {
    const { idProjet } = req.params; // Extract project ID from URL parameters
    const { nomTache, descTache, dateDebut, dateFin, priorite, idUtilisateur } = req.body; // Extract task details from request body

    try {
        // Determine the initial status of the task
        let statutTache = 'En attente';

        if (idUtilisateur) {
            const today = moment().startOf('day');
            const startDate = moment(dateDebut).startOf('day');

            if (startDate.isSameOrBefore(today)) {
                statutTache = 'En cours';
            }
        }

        // Create the new task with the determined status
        const newTache = await Tache.create({
            nomTache,
            descTache,
            statutTache,
            dateDebut,
            dateFin,
            priorite,
            idProjet
        });

        // If the task has a user assignment, create the assignment
        if (idUtilisateur) {
            await Assigner.create({
                idUtilisateur,
                idTache: newTache.idTache
            });
            // creat Notification
            const projet = await Projet.findByPk(idProjet);
            const utilisateur = await User.findByPk(idUtilisateur);
            const titreNotif = `Nouvelle tâche assignée`;
            const contenuNotif = `${utilisateur.nom} ${utilisateur.prenom}, une nouvelle tâche vous a été assignée dans le projet "${projet.nomProjet}".`;

            const notificationData = {
            titreNotif,
             contenuNotif,
             idUtilisateur: idUtilisateur , 
            idProjet : idProjet
            };
             await notificationControlller.createNotif(notificationData)
      


        }
        const createdTache = await Tache.findOne({
            where: { idTache: newTache.idTache },
            include: [
                {
                    model: Assigner,
                    include: [
                        {
                            model: User,
                            attributes: ['idUtilisateur', 'nomUtilisateur', 'image']
                        }
                    ]
                }
            ],
            attributes: ['idTache', 'nomTache', 'descTache', 'statutTache', 'dateDebut', 'dateFin', 'priorite', 'idProjet', 'createdAt', 'updatedAt']
        });
        res.status(201).json(createdTache);
    } catch (error) {
        console.error('Error creating tache:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };

// Get all tasks
exports.getAllTaches = async (req, res) => {
    try {
        const taches = await Tache.findAll();
        res.status(200).json(taches);
    } catch (error) {
        console.error('Error getting tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get task by ID
exports.getTacheById = async (req, res) => {
    const { id } = req.params;
    try {
        const tache = await Tache.findByPk(id, {
            include: [
                {
                    model: Assigner,
                    include: [
                        {
                            model: User,
                            attributes: ['idUtilisateur', 'nomUtilisateur', 'image']
                        }
                    ]
                }
            ],
            attributes: ['idTache', 'nomTache', 'descTache', 'statutTache', 'dateDebut', 'dateFin', 'priorite', 'idProjet', 'createdAt', 'updatedAt']
        });

        if (!tache) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check and update the task status
        const today = moment().startOf('day');
        const startDate = moment(tache.dateDebut).startOf('day');
        const assignation = tache.Assigners && tache.Assigners.length > 0;

        if (tache.statutTache === 'En attente' && assignation && startDate.isSameOrBefore(today)) {
            tache.statutTache = 'En cours';
        }

        res.status(200).json(tache);
    } catch (error) {
        console.error('Error getting task by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get tasks by project ID

exports.getTacheByProjetId = async (req, res) => {
    const { idProjet } = req.params;
    const idUtilisateur = req.user.userId; // récupéré du token

    try {
        // Récupérer toutes les tâches pour le projet donné
        let taches = await Tache.findAll({
            where: { idProjet },
            include: [
                {
                    model: Assigner,
                    include: [
                        {
                            model: User,
                            attributes: ['idUtilisateur', 'nomUtilisateur', 'image']
                        }
                    ]
                }
            ],
            attributes: ['idTache', 'nomTache', 'descTache', 'statutTache', 'dateDebut', 'dateFin', 'priorite', 'idProjet', 'createdAt', 'updatedAt']
        });

        if (!taches || taches.length === 0) {
            return res.status(200).json({
                message: 'No tasks found for this project',
                taches: [],
                mesTaches: []
            });
        }

        const today = moment().startOf('day');

        // Traiter les tâches pour mettre à jour leur statut si nécessaire
        taches = taches.map(tache => {
            const startDate = moment(tache.dateDebut).startOf('day');
            const assignation = tache.Assigners && tache.Assigners.length > 0;

            if (tache.statutTache === 'En attente' && assignation && startDate.isSameOrBefore(today)) {
                tache.statutTache = 'En cours';
            }

            return tache;
        });

        // Filtrer les tâches assignées à l'utilisateur
        const mesTaches = taches.filter(tache => 
            tache.Assigners.some(assigner => assigner.idUtilisateur === idUtilisateur)
        );

        res.status(200).json({
            message: 'Tasks retrieved successfully',
            taches: taches,
            mesTaches: mesTaches
        });
    } catch (error) {
        console.error('Error getting tasks by project ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Get tasks by user ID
exports.getTasksByUserId = async (req, res) => {
    const idUtilisateur = req.user.userId; // Extract user ID from token
    const { idProjet } = req.params; // Extract project ID from URL

    try {
        // Check if the user exists
        const user = await User.findByPk(idUtilisateur);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch tasks assigned to the user within the project
        const tasks = await Tache.findAll({
            where: { idProjet },
            include: {
                model: Assigner,
                where: { idUtilisateur },
                include: [
                    {
                        model: User,
                        attributes: ['idUtilisateur', 'nomUtilisateur', 'image']
                    }
                ],
                attributes: []
            },
            attributes: ['idTache', 'nomTache', 'descTache', 'statutTache', 'dateDebut', 'dateFin', 'priorite', 'idProjet', 'createdAt', 'updatedAt']
        });

        // Update the task status based on the current date
        const today = moment().startOf('day');
        const updatedTasks = tasks.map(task => {
            const startDate = moment(task.dateDebut).startOf('day');
            const assignation = task.Assigners && task.Assigners.length > 0;

            if (task.statutTache === 'En attente' && assignation && startDate.isSameOrBefore(today)) {
                task.statutTache = 'En cours';
            }

            return task;
        });

        res.status(200).json(updatedTasks);
    } catch (error) {
        console.error('Error getting tasks by user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllUserTasks = async (req, res) => {
    const idUtilisateur = req.user.userId; 
    console.log(idUtilisateur)
    try {
        // Check if the user exists
        const user = await User.findByPk(idUtilisateur);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasks = await Assigner.findAll({
            where: { idUtilisateur },
            include: {
                model: Tache,
                attributes: ['idTache', 'nomTache', 'descTache', 'statutTache', 'dateDebut', 'dateFin', 'priorite', 'idProjet', 'createdAt', 'updatedAt'],
                include:{
                    model : Projet,
                    attributes:['nomProjet','URL']
                }
            },   
                
                attributes:[]
        
        });

        // Update the task status based on the current date
        const today = moment().startOf('day');
        const updatedTasks = tasks.map(task => {
            const startDate = moment(task.dateDebut).startOf('day');
            const assignation = task.Assigners && task.Assigners.length > 0;

            if (task.statutTache === 'En attente' && assignation && startDate.isSameOrBefore(today)) {
                task.statutTache = 'En cours';
            }

            return task;
        });

        res.status(200).json(updatedTasks);
    } catch (error) {
        console.error('Error getting tasks by user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Update task by ID
exports.updateTacheById = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Fetch the task to be updated
        const tacheToUpdate = await Tache.findByPk(id);
        if (!tacheToUpdate) {
            throw new Error('Task not found');
        }



        // Proceed with updating the task
        const [updated] = await Tache.update(req.body, {
            where: { idTache: id }
        });

        if (updated) {
            // Fetch the updated task with its Assigners
            const updatedTache = await Tache.findByPk(id, {
                include: [
                    {
                        model: Assigner,
                        include: [
                            {
                                model: User,
                                attributes: ['idUtilisateur', 'nomUtilisateur', 'image']
                            }
                        ]
                    }
                ]
            });

            if (!updatedTache) {
                throw new Error('Task not found');
            }
             // Check if the task has any assignments
             const hasAssignments = updatedTache.Assigners && updatedTache.Assigners.length > 0;

             const startDate = moment(updatedTache.dateDebut).startOf('day');
             const today = moment().startOf('day');
             
             // Update the task status if necessary
             if (updatedTache.statutTache === 'En attente' && hasAssignments && startDate.isSameOrBefore(today)) {
                 updatedTache.statutTache = 'En cours';
                 await updatedTache.save(); // Save the updated status
             }
           // Create notifications for all assigned users
           const projet = await Projet.findByPk(updatedTache.idProjet);

           for (const assigner of updatedTache.Assigners) {
               const utilisateur = assigner;
               const titreNotif = `Tâche mise à jour`;
               const contenuNotif = `La tâche "${updatedTache.nomTache}" dans le projet "${projet.nomProjet}" a été mise à jour.`;

               const notificationData = {
                   titreNotif,
                   contenuNotif,
                   idUtilisateur: utilisateur.idUtilisateur,
                   idProjet: updatedTache.idProjet
               };

               await notificationControlller.createNotif(notificationData)
           }



            return res.status(200).json(updatedTache);
        }

        throw new Error('Task not found');
    } catch (error) {
        console.error('Error updating task by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updateStatut = async (req, res) => {
    const { id } = req.params;
    const { statutTache } = req.body;
    const idUtilisateur = req.user.userId;
    if (!['En attente', 'En cours', 'Terminé'].includes(statutTache)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        // Update the task status
        const [updated] = await Tache.update(
            { statutTache },
            {
                where: { idTache: id }
            }
        );

        // Check if any row was updated
        if (updated) {
            // Fetch the updated task with the necessary associations and attributes
            const updatedTache = await Tache.findOne({
                where: { idTache: id },
                include: [
                    {
                        model: Assigner,
                        include: [
                            {
                                model: User,
                                attributes: ['idUtilisateur', 'nomUtilisateur', 'image']} ] } ],
                attributes: ['idTache', 'nomTache', 'descTache', 'statutTache', 'dateDebut', 'dateFin', 'priorite', 'idProjet', 'createdAt', 'updatedAt']
            });
              
          // Create notification only if the status is 'Terminé'
          if (statutTache === 'Terminé') {
            const projet = await Projet.findByPk(updatedTache.idProjet) ;
            
            const user = await User.findByPk(idUtilisateur);
            // Create notification for assigned users
            for (const assigner of updatedTache.Assigners) {
                const utilisateur = assigner.User;
                if (utilisateur.idUtilisateur !== idUtilisateur) {
                 const titreNotif = `Tâche terminée`;
                const contenuNotif = ` ${user.nom} ${user.prenom}  a terminer la tâche : ${updatedTache.nomTache} dans le projet ${projet.nomProjet} `;

                const notificationData = {
                    titreNotif,
                    contenuNotif,
                    idUtilisateur: utilisateur.idUtilisateur,
                    idProjet: updatedTache.idProjet
                };

                await notificationControlller.createNotif(notificationData);   
                }

                
            }
            if (projet.idChefProjet !== idUtilisateur) {
              const titreNotifChef = `Tâche terminée`;
            const contenuNotifChef = `${user.nom} ${user.prenom} a terminer la tâche : ${updatedTache.nomTache} dans le projet ${projet.nomProjet} .`;
            
            const notificationDataChef = {
                titreNotif: titreNotifChef,
                contenuNotif: contenuNotifChef,
                idUtilisateur: projet.idChefProjet,
                idProjet: updatedTache.idProjet
            };

            await notificationControlller.createNotif(notificationDataChef);  
            }
            // Create notification for project manager (chef de projet)
            
        }
            // Return the updated task data
            return res.status(200).json(updatedTache);
        }

        // No task found with the given ID
        return res.status(404).json({ message: 'Task not found' });
    } catch (error) {
        console.error('Error updating task status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// ajouter destroy assigner avant destroy task
// Delete task by ID
exports.deleteTacheById = async (req, res) => {
    const { id } = req.params;

    try {
        
        const tacheToDelete = await Tache.findByPk(id, {
            include: [
                {
                    model: Assigner,
                    include: [  {
                            model: User,
                            attributes: ['idUtilisateur', 'nom', 'prenom', 'image'] }  ] } ] });
                            const projet = await Projet.findByPk(tacheToDelete.idProjet) ;
                          for (const assigner of tacheToDelete.Assigners) {
                              const utilisateur = assigner.User;
                                const titreNotif = `Tâche supprimée`;
                                const contenuNotif = `La tâche : ${tacheToDelete.nomTache} dans le projet ${projet.nomProjet} a été supprimée.`;
                    
                                const notificationData = {
                                    titreNotif,
                                    contenuNotif,
                                    idUtilisateur: utilisateur.idUtilisateur,
                                    idProjet: tacheToDelete.idProjet
                                };
                    
                                await notificationControlller.createNotif(notificationData);
                            }

        // Delete assignations associated with the task
        await Assigner.destroy({
            where: { idTache: id }
        });

        // Delete the task itself
        const deleted = await Tache.destroy({
            where: { idTache: id }
        });

        if (deleted) { 
            return res.status(200).json({message: "Tache supprimer"});
        } else {
            throw new Error('Task not found');
        }
    } catch (error) {
        console.error('Error deleting task by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

