const { and } = require('sequelize');
const { Assigner , Tache,User,Projet,Notification} = require('../models');
const moment = require('moment');
const notificationControlller=require('./notificationController')
// Create a new assignation
exports.createAssignation = async (req, res) => {
    try {
        const { idUtilisateur, idTache } = req.body;

        // Create the assignment
        const assignation = await Assigner.create({ idUtilisateur, idTache });

        // Fetch the updated task with its associations
        const updatedTache = await Tache.findOne({
            where: { idTache },
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

        // Check if the task is assigned
        const isAssigned = updatedTache.Assigners && updatedTache.Assigners.length > 0;

        // Get today's date and the start date of the task
        const today = moment().startOf('day');
        const startDate = moment(updatedTache.dateDebut).startOf('day');

        // Update the task status based on the start date and current status
        if (updatedTache.statutTache === 'En attente' && isAssigned && startDate.isSameOrBefore(today)) {
            updatedTache.statutTache = 'En cours';
            await updatedTache.save(); // Save the updated status
        }
         // creat Notification
         const projet = await Projet.findByPk(updatedTache.idProjet);
         const utilisateur = await User.findByPk(idUtilisateur);
         const titreNotif = `Nouvelle tâche assignée`;
         const contenuNotif = `${utilisateur.nom} ${utilisateur.prenom}, une nouvelle tâche vous a été assignée dans le projet "${projet.nomProjet}".`;

         const notificationData = {
         titreNotif,
          contenuNotif,
          idUtilisateur: idUtilisateur , 
         idProjet : updatedTache.idProjet
         };
          await notificationControlller.createNotif(notificationData)
        res.status(201).json(updatedTache); // Return the updated task
    } catch (error) {
        console.error('Error creating assignation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get all assignations
exports.getAllAssignations = async (req, res) => {
    try {
        const assignations = await Assigner.findAll();
        res.status(200).json(assignations);
    } catch (error) {
        console.error('Error getting assignations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get assignation by ID
exports.getAssignationById = async (req, res) => {
    const { id } = req.params;
    try {
        const assignation = await Assigner.findByPk(id);
        if (!assignation) {
            return res.status(404).json({ message: 'Assignation not found' });
        }
        res.status(200).json(assignation);
    } catch (error) {
        console.error('Error getting assignation by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




// Delete assignation by ID
exports.deleteAssignationById = async (req, res) => {
    const { idUtilisateur, idTache } = req.params; // Extract parameters

    try {
        // Delete the assignment
        const deleted = await Assigner.destroy({
            where: { idUtilisateur, idTache }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Assignation not found' });
        }

        // Check if there are any remaining assignments for the task
        const remainingAssignments = await Assigner.findAll({
            where: { idTache }
        });

        // If no remaining assignments, update the task status to 'En attente'
        if (remainingAssignments.length === 0) {
            await Tache.update(
                { statutTache: 'En attente' },
                { where: { idTache } }
            );
        }

        // Fetch the updated task with its associations
        const updatedTache = await Tache.findOne({
            where: { idTache },
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
            attributes: ['idTache', 'nomTache' , 'descTache',  'statutTache', 'dateDebut', 'dateFin', 'priorite', 'idProjet', 'createdAt', 'updatedAt']
        });

        // Update the task status based on the start date and current status
        const today = moment().startOf('day');
        const startDate = moment(updatedTache.dateDebut).startOf('day');
        const isAssigned = updatedTache.Assigners && updatedTache.Assigners.length > 0;

        if (updatedTache.statutTache === 'En attente' && isAssigned && startDate.isSameOrBefore(today)) {
            updatedTache.statutTache = 'En cours';
            await updatedTache.save(); // Save the updated status
        }
        const projet = await Projet.findByPk(updatedTache.idProjet);
        const utilisateur = await User.findByPk(idUtilisateur);
        const titreNotif = `Changement d'assignation de tâche`;
        const contenuNotif = `La tâche "${updatedTache.nomTache}" dans le projet "${projet.nomProjet}" ne vous est plus assignée, ${utilisateur.nom} ${utilisateur.prenom}.`;
        const notificationData = {
        titreNotif,
         contenuNotif,
         idUtilisateur: idUtilisateur , 
        idProjet : updatedTache.idProjet
        };
         await notificationControlller.createNotif(notificationData)
        return res.status(200).json(updatedTache); 
    } catch (error) {
        console.error('Error deleting assignation by ID:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
