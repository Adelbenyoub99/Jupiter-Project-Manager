const { DemandeAdhesion, Participation,Projet , User,Notification} = require('../models');
const participerContoller = require('./participerController');
const notificatioController=require('./notificationController')
const ms = require('ms');
const { Op } = require("sequelize");
// Create a new demande d'adhésion oui
exports.createDemandeAdhesion = async (req, res) => {
    try {
        const { idProjet } = req.body;
        const idUtilisateur = req.user.userId;
        const demandeAdhesion = await DemandeAdhesion.create({ idUtilisateur, idProjet, etatDemande:'En cours' });
       

         // Création de la notification
         const projet = await Projet.findByPk(idProjet); // Récupère les informations du projet
         const utilisateur = await User.findByPk(idUtilisateur); // Récupère les informations de l'utilisateur
 
         const titreNotif = `Nouvelle demande d'adhésion`;
         const contenuNotif = `${utilisateur.nom} ${utilisateur.prenom} a demandé de rejoindre le projet ${projet.nomProjet}.`;
         const notificationData = {
            titreNotif,
            contenuNotif,
            idUtilisateur: projet.idChefProjet , 
            idProjet
        };
        const notification=await notificatioController.createNotif(notificationData)
        res.status(201).json({ demandeAdhesion});
    } catch (error) {
        console.error('Error creating demande d\'adhésion:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all demandes d'adhésion oui
exports.getAllDemandesAdhesion = async (req, res) => {
    try {
        const demandesAdhesion = await DemandeAdhesion.findAll();
        res.status(200).json(demandesAdhesion);
    } catch (error) {
        console.error('Error getting demandes d\'adhésion:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get demande d'adhésion by ID oui
exports.getDemandeAdhesionById = async (req, res) => {
    const { id } = req.params;
    try {
        const demandeAdhesion = await DemandeAdhesion.findByPk(id);
        if (!demandeAdhesion) { 
            return res.status(404).json({ message: 'Demande d\'adhésion not found' });
        }
        res.status(200).json(demandeAdhesion);
    } catch (error) {
        console.error('Error getting demande d\'adhésion by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
 
// Get demande d'adhésion by User ID oui
exports.getDemandeByIdUser = async (req, res) => {
    const idUtilisateur = req.user.userId;
    console.log('hello'+idUtilisateur);
    try {
        // Step 1: Fetch DemandeAdhesion entries for the user
        const demandesAdhesion = await DemandeAdhesion.findAll({
            where: { idUtilisateur }
        });

        if (demandesAdhesion.length === 0) {
            return res.status(200).json({  message: 'No demandes found for this user',
                demandes: [] });
        }

        // Step 2: Extract idProjet values
        const idProjets = demandesAdhesion.map(demande => demande.idProjet);

        // Step 3: Fetch corresponding Projet details
        const projets = await Projet.findAll({
            where: {
                idProjet: idProjets
            },
            attributes: ['idProjet', 'nomProjet', 'descProjet']
        });

        // Step 4: Combine results
        const result = demandesAdhesion.map(demande => {
            const projet = projets.find(proj => proj.idProjet === demande.idProjet);
            return {
                ...demande.toJSON(),
                nomProjet: projet ? projet.nomProjet : null,
                descriptionProjet: projet ? projet.descProjet : null
            };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting demandes by User ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get demande d'adhésion by Project ID non
exports.getDemandeByIdProject = async (req, res) => {
    const { idProjet } = req.params;
    try {
        const demandesAdhesion = await DemandeAdhesion.findAll({
            where: { idProjet },
             include: [
                {
                    model: User,
                   }]
        });
        if (demandesAdhesion.length === 0) {
            return res.status(200).json(
                 []
            ); 
        }
        res.status(200).json(demandesAdhesion);
    } catch (error) {
        console.error('Error getting demandes by Project ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Récupérer les demandes d'adhésion d'un projet donné dont l'état est 'Accepter' ou 'Refuser' oui
exports.getDemandeByIdProjectAttributeAccepteRefuse = async (req, res) => {
    const { idProjet } = req.params;
    try {
        const demandesAdhesion = await DemandeAdhesion.findAll({
            where: {
                idProjet,
                etatDemande: ['Acceptée', 'Refusée']
            },
            include: [
                {
                    model: User,
                   }]
        });
        if (!demandesAdhesion) {
            return res.status(404).json({ message: 'Aucune demande d\'adhésion trouvée pour ce projet' });
        }
        res.status(200).json(demandesAdhesion);
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes d\'adhésion:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

const scheduleDemandeDeletion = (idDemande) => {
    const cron = require('node-cron');
    
    // Tâche pour exécuter tous les jours à minuit
    cron.schedule("20 14 * * *", async () => {
        try {
            const demandeAdhesion = await DemandeAdhesion.findByPk(idDemande);
            if (demandeAdhesion) {
                await DemandeAdhesion.destroy({
                    where: {
                        idDemande: idDemande,
                        createdAt: {
                            [Op.lt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // Supprime les demandes créées il y a plus de 30 jours
                        }
                    }
                });
                console.log(`Demande d'adhésion avec ID ${idDemande} supprimée après 30 jours.`);
            }
        } catch (error) {
            console.error('Error deleting expired demande d\'adhésion:', error);
        }
    });
};
// Update demande d'adhésion to 'Refuse' and schedule deletion after 30 days (pas en 30 D)
exports.updateEtatRefuser = async (req, res) => {
    const id = req.params.idD;

    try {
        const demandeAdhesion = await DemandeAdhesion.findByPk(id);
        if (!demandeAdhesion) {
            return res.status(404).json({ message: 'Demande d\'adhésion not found' });
        }

        await DemandeAdhesion.update({ etatDemande: 'Refusée' }, {
            where: { idDemande: id }
        });

        // Suppression après 30 jours
        scheduleDemandeDeletion(id);
    
       // Création de la notification
       const projet = await Projet.findByPk(demandeAdhesion.idProjet);
       const utilisateur = await User.findByPk(demandeAdhesion.idUtilisateur);

       const titreNotif = `Demande d'adhésion refusée`;
       const contenuNotif = `${utilisateur.nom} ${utilisateur.prenom}  Votre demande d'adhésion au projet "${projet.nomProjet}" a été refusée.`;

       const notificationData = {
        titreNotif,
        contenuNotif,
        idUtilisateur: demandeAdhesion.idUtilisateur , 
        idProjet : demandeAdhesion.idProjet
    };
         await notificatioController.createNotif(notificationData)


        const updatedDemandeAdhesion = await DemandeAdhesion.findByPk(id);
      
        return res.status(200).json({ message: 'Demande d\'adhésion mise à jour et sera supprimée après 30 jours', updatedDemandeAdhesion });
        
    } catch (error) {
        console.error('Error updating demande d\'adhésion to Refuser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Met à jour l'état de la demande à "Annulée"
exports.updateEtatAnnuler = async (req, res) => {
    const id = req.params.idD;

    try {
        const demandeAdhesion = await DemandeAdhesion.findByPk(id);
        if (!demandeAdhesion) {
            return res.status(404).json({ message: 'Demande d\'adhésion not found' });
        }

        await DemandeAdhesion.update({ etatDemande: 'Annulée' }, {
            where: { idDemande: id }
        });

        // Suppression après 30 jours
        scheduleDemandeDeletion(id);

        const updatedDemandeAdhesion = await DemandeAdhesion.findByPk(id);
        return res.status(200).json({ message: 'Demande d\'adhésion mise à jour et sera supprimée après 30 jours', updatedDemandeAdhesion });

    } catch (error) {
        console.error('Error updating demande d\'adhésion to Annuler:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Met à jour l'état de la demande à "Acceptée"
exports.updateEtatAccepter = async (req, res) => {
    const id = req.params.idD;

    try {
        const demandeAdhesion = await DemandeAdhesion.findByPk(id);
        if (!demandeAdhesion) {
            return res.status(404).json({ message: 'Demande d\'adhésion not found' });
        }

        await DemandeAdhesion.update({ etatDemande: 'Acceptée' }, {
            where: { idDemande: id }
        });
          // Create a new participation with role 'Collaborateur'
          const participationData = {
            idUtilisateur: demandeAdhesion.idUtilisateur,
            idProjet: demandeAdhesion.idProjet,
            role: 'Collaborateur'
        };
        const participation = await participerContoller.createParticipation(participationData);
        // create new notification
        const projet = await Projet.findByPk(demandeAdhesion.idProjet);
        const utilisateur = await User.findByPk(demandeAdhesion.idUtilisateur);

   const titreNotif = `Demande d'adhésion acceptée`;
   const contenuNotif = `${utilisateur.nom} ${utilisateur.prenom}  Votre demande d'adhésion au projet "${projet.nomProjet}" a été acceptée.`;

   const notificationData = {
    titreNotif,
    contenuNotif,
    idUtilisateur: demandeAdhesion.idUtilisateur , 
    idProjet : demandeAdhesion.idProjet
};
     await notificatioController.createNotif(notificationData)



        // Suppression après 30 jours
        scheduleDemandeDeletion(id);

        const updatedDemandeAdhesion = await DemandeAdhesion.findByPk(id);
        return res.status(200).json({ message: 'Demande d\'adhésion mise à jour et sera supprimée après 30 jours',
            demandeAdhesion: updatedDemandeAdhesion,
            participation: participation});

    } catch (error) {
        console.error('Error updating demande d\'adhésion to Accepter:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fonction pour planifier la suppression après 30 jours

// Delete demande d'adhésion by ID oui
exports.deleteDemandeAdhesionById = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await DemandeAdhesion.destroy({
            where: { idDemande: id }
        });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('Demande d\'adhésion not found');
    } catch (error) {
        console.error('Error deleting demande d\'adhésion by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
