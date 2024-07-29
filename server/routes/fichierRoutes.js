const express = require('express');
const router = express.Router();
const fichierController = require('../Controllers/fichierController');
const verifyToken = require('../middlewares/verifyToken');
const verifyChefAndAdjoint = require('../middlewares/verifyChefAndAdjoint');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyChef = require('../middlewares/verifyChef');

// Create a new fichier
router.post('/', verifyToken, fichierController.createFichier);

// Get all fichiers
router.get('/', verifyAdmin, fichierController.getAllFichiers);

// Get fichier by ID
router.get('/:id', verifyToken, fichierController.getFichierById);

// Update fichier by ID
router.put('/:id', verifyToken, verifyChefAndAdjoint, fichierController.updateFichierById);

// Delete fichier by ID
router.delete('/:id', verifyToken, verifyChefAndAdjoint, fichierController.deleteFichierById);

module.exports = router;
