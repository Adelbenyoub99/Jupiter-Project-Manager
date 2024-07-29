const { where } = require('sequelize');
const { Participation, Projet, User,Notification,Tache,Assigner } = require('../models');
const notificationController=require('./notificationController')


exports.createParticipation = async (participationData) => {
    try {
        const { idUtilisateur, idProjet, role } = participationData;
        const participation = await Participation.create({ idUtilisateur, idProjet, role });
        return participation;
    } catch (error) {
        console.error('Error creating participation:', error);
        throw new Error('Internal server error');
    }
};
// Create a new participation
exports.createMembre = async (req, res) => {
    const { idUtilisateur } = req.body;
    const { idProjet } = req.params;
  
    try {
      // Vérifier si l'utilisateur est déjà membre du projet 
      const existingParticipation = await Participation.findOne({
        where: { idUtilisateur, idProjet }
      });
  
      if (existingParticipation) {
        return res.status(200).json({message:"L'utilisateur est déjà membre de ce projet."});
      }
  
      // Si l'utilisateur n'est pas encore membre, créer une nouvelle participation
      const participationData = {
        idUtilisateur,
        idProjet,
        role: 'Collaborateur' // Rôle statique de "Collaborateur"
      };
  
      const participation = await Participation.create(participationData);
  
      // Après création, récupérez les détails complets de la participation avec l'utilisateur associé
      const newParticipation = await Participation.findOne({
        where: { idParticipation: participation.idParticipation },
        include: [{ model: User }]
      });
      //creation de notification 
      const projet = await Projet.findByPk(idProjet);
      const titreNotif = 'Nouvelle collaboration ajoutée';
      const contenuNotif = `Vous avez été ajouté au projet ${projet.nomProjet}.`;

      const notificationData = {
          titreNotif,
          contenuNotif,
          idUtilisateur: idUtilisateur,
          idProjet: idProjet
      };

      await notificationController.createNotif(notificationData);


      res.status(201).json(newParticipation);
    } catch (error) {
      console.error('Error creating participation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

/// create participation from share project

exports.createFromSharedUrl = async (req, res) => {
    const idUtilisateur = req.user.userId;
    const { idProjet } = req.params;
  
    try {
      // Vérifier si l'utilisateur est déjà membre du projet 
      const existingParticipation = await Participation.findOne({
        where: { idUtilisateur, idProjet }
      });
  
      if (existingParticipation) {
        return res.status(200).json({message:"L'utilisateur est déjà membre de ce projet."});
      }
  
      // Si l'utilisateur n'est pas encore membre, créer une nouvelle participation
      const participationData = {
        idUtilisateur,
        idProjet,
        role: 'Collaborateur' // Rôle statique de "Collaborateur"
      };
  
      const participation = await Participation.create(participationData);
  
      // Après création, récupérez les détails complets de la participation avec l'utilisateur associé
      const newParticipation = await Participation.findOne({
        where: { idParticipation: participation.idParticipation },
        include: [{ model: User }]
      });
      //creation de notification 
      const projet = await Projet.findByPk(idProjet);
      const titreNotif = 'Nouvelle collaboration ajoutée';
      const contenuNotif = `Vous avez été ajouté au projet ${projet.nomProjet}.`;

      const notificationData = {
          titreNotif,
          contenuNotif,
          idUtilisateur: idUtilisateur,
          idProjet: idProjet
      };

      await notificationController.createNotif(notificationData);
      res.status(201).json(newParticipation);
    } catch (error) {
      console.error('Error creating participation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
// Get all participations
exports.getAllParticipations = async (req, res) => {
    try {
        const participations = await Participation.findAll();
        res.status(200).json(participations);
    } catch (error) {
        console.error('Error getting participations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get participation by ID
exports.getParticipationById = async (req, res) => {
    const { id } = req.params;
    try {
        const participation = await Participation.findByPk(id, {
            include: [
                { model: Projet },
                { model: User }
            ]
        });
        if (!participation) {
            return res.status(404).json({ message: 'Participation not found' });
        }
        res.status(200).json(participation);
    } catch (error) {
        console.error('Error getting participation by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProjectParticipation = async (req, res) => {
    const { idProjet } = req.params;
    try {
        const participations = await Participation.findAll({
            where:{idProjet},
            include: [
              
                { model: User  }
            ]
        });
        if (!participations) {
            return res.status(204).json({ message: 'Participation not found' ,membre:[] });
        }
        res.status(200).json({'membres':participations}); 
    } catch (error) {
        console.error('Error getting participation by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update role from Collaborateur to Adjoint
exports.updateRoleColabToAdjoint = async (req, res) => {
    const {idProjet  ,idUtilisateur } = req.params;
    try {
        // Find the participation record to update
        const participation = await Participation.findOne({
            where: {
                idUtilisateur,
                idProjet,
                role: 'Collaborateur'  // Ensure we're only updating Collaborateurs
            }
        });

        if (!participation) {
            return res.status(404).json({ message: 'Participation not found or not a Collaborateur' });
        }

        // Update the role to Adjoint
        participation.role = 'Adjoint';
        await participation.save();

        //creation d'une notification
        const projet = await Projet.findByPk(idProjet);
      const titreNotif = 'Promotion ';
      const contenuNotif = `Vous avez été désigné comme adjoint dans le projet ${projet.nomProjet}.`;

      const notificationData = {
          titreNotif,
          contenuNotif,
          idUtilisateur: idUtilisateur,
          idProjet: idProjet
      };

      await notificationController.createNotif(notificationData);
        res.status(200).json({ message: 'Role updated to Adjoint successfully', participation });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update role from Adjoint to Collaborateur
exports.updateRoleAdjointToColab = async (req, res) => {
     const {idProjet  ,idUtilisateur } = req.params;
    try {
        // Trouver la participation par idUtilisateur et idProjet
        const participation = await Participation.findOne({
            where: { idUtilisateur, idProjet, role: 'Adjoint' }
        });
        
        if (!participation) {
            return res.status(404).json({ message: 'Participation not found or not Adjoint' });
        }

        // Mettre à jour le rôle de Adjoint à Collaborateur
        participation.role = 'Collaborateur';
        await participation.save();
         //creation d'une notification
         const projet = await Projet.findByPk(idProjet);
         const titreNotif = 'Rétrogradation';
         const contenuNotif = `Vous avez été rétrograder, vous n'êtes plus adjoint dans le projet ${projet.nomProjet}.`;
   
         const notificationData = {
             titreNotif,
             contenuNotif,
             idUtilisateur: idUtilisateur,
             idProjet: idProjet
         };
   
         await notificationController.createNotif(notificationData);
        res.status(200).json({ message: 'Role updated successfully', participation });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete participation by ID
exports.deleteParticipationById = async (req, res) => {
    const { id } = req.params;
    try {

        const participation=await Participation.findByPk(id)
        //creation de notification 
      const projet = await Projet.findByPk(participation.idProjet);
      const titreNotif = 'Supprimer de projet';
      const contenuNotif = `Vous avez été supprimé de projet ${projet.nomProjet}.`;

      const notificationData = {
          titreNotif,
          contenuNotif,
          idUtilisateur: participation.idUtilisateur,
          idProjet: participation.idProjet
      };

      await notificationController.createNotif(notificationData);

      const taches = await Tache.findAll({
        where: { idProjet: projet.idProjet }
    });
    // Supprimer les assignations de l'utilisateur pour ces tâches
    for (const tache of taches) {
        await Assigner.destroy({
            where: {
                idUtilisateur: participation.idUtilisateur,
                idTache: tache.idTache
            }
        });
    }

        // Delete participation
        const deleted = await Participation.destroy({
            where: { idParticipation: id }
        });
        if (deleted) {
            return res.status(200).json({message: "Membre supprimer"});
        }
        throw new Error('Participation not found');
    } catch (error) {
        console.error('Error deleting participation by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete participation quitter
exports.deleteParticipation = async (req, res) => {
    const { idProjet } = req.params;
    const idUtilisateur = req.user.userId; //from token
    try {

          //creation de notification 
      const projet = await Projet.findByPk(idProjet);
      const titreNotif = 'Quitter un projet';
      const contenuNotif = `Vous avez quittez le projet ${projet.nomProjet}.`;

      const notificationData = {
          titreNotif,
          contenuNotif,
          idUtilisateur:idUtilisateur,
          idProjet: idProjet
      };

      await notificationController.createNotif(notificationData);
      const taches = await Tache.findAll({
        where: { idProjet: idProjet }
    });
    // Supprimer les assignations de l'utilisateur pour ces tâches
    for (const tache of taches) {
        await Assigner.destroy({
            where: {
                idUtilisateur: idUtilisateur,
                idTache: tache.idTache
            }
        });
    }
        // Delete participation
        const deleted = await Participation.destroy({
            where: { idProjet , idUtilisateur }
        });
        if (deleted) {
            return res.status(200).json({message: "projet quitté"});
        }
        throw new Error('Participation not found');
    } catch (error) {
        console.error('Error deleting participation by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
