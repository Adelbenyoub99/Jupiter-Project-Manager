const express = require('express');
const router = express.Router();
const demandeadhesionController = require('../Controllers/demandeAdhesionController');
const verifyToken = require('../middlewares/verifyToken');
const verifyChefAndAdjoint = require('../middlewares/verifyChefAndAdjoint');
const verifyChef = require('../middlewares/verifyChef');
const verifyAdmin = require('../middlewares/verifyAdmin');

// Create a new demande d'adhésion oui
router.post('/', verifyToken, demandeadhesionController.createDemandeAdhesion);

// Get all demandes d'adhésion oui
router.get('/', verifyAdmin, demandeadhesionController.getAllDemandesAdhesion);

// Get demande d'adhésion by ID oui
router.get('/', verifyToken, demandeadhesionController.getDemandeAdhesionById);

// Get demandes d'adhésion by User ID oui
router.get('/user', verifyToken, demandeadhesionController.getDemandeByIdUser);

// Get demandes d'adhésion by Project ID non 
router.get('/projet/:idProjet', verifyToken, demandeadhesionController.getDemandeByIdProject);

// Récupérer les demandes d'adhésion d'un projet donné avec l'état 'Accepter' ou 'Refuser' oui
router.get('/projet/:idProjet/accepteRefuse', verifyToken, demandeadhesionController.getDemandeByIdProjectAttributeAccepteRefuse);
/*
// Update demande d'adhésion by ID
router.put('/:id', verifyToken, demandeadhesionController.updateDemandeAdhesionById);*/

// Update demande d'adhésion to 'Refuser' (pas en 30 D)
router.put('/:idProjet/:idD/refuser', verifyToken, verifyChef, demandeadhesionController.updateEtatRefuser);
 
// Update demande d'adhésion to 'Accepter' and create participation (non autoriser)
router.put('/:idProjet/:idD/accepter', verifyToken, verifyChef, demandeadhesionController.updateEtatAccepter);
// update demande d'adhesion annuler pa le deamndeur
router.put('/:idD/annuler', verifyToken, demandeadhesionController.updateEtatAnnuler);
// Delete demande d'adhésion by ID oui
router.delete('/:id', verifyToken, demandeadhesionController.deleteDemandeAdhesionById);

module.exports = router;
