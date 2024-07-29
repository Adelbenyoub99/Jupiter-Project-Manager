const express = require('express');
const router = express.Router();
const dossierController = require('../Controllers/dossierController');
const verifyToken = require('../middlewares/verifyToken');
const verifyChefAndAdjoint = require('../middlewares/verifyChefAndAdjoint');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyChef = require('../middlewares/verifyChef');

// Create a new dossier
router.post('/', verifyToken, verifyChefAndAdjoint, dossierController.createDossier);

// Get all dossiers
router.get('/', verifyAdmin, dossierController.getAllDossiers);

// Get dossier by ID
router.get('/:id', verifyToken, dossierController.getDossierById);

// Update dossier by ID
router.put('/:id', verifyToken, verifyChefAndAdjoint, dossierController.updateDossierById);

// Delete dossier by ID
router.delete('/:id', verifyToken, verifyChefAndAdjoint, dossierController.deleteDossierById);

module.exports = router;
