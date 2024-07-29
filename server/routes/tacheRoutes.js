const express = require('express');
const router = express.Router();
const tacheController = require('../Controllers/tacheController');
const verifyToken = require('../middlewares/verifyToken');
const verifyChefAndAdjoint = require('../middlewares/verifyChefAndAdjoint');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyChef = require('../middlewares/verifyChef');

// Create a new tache
router.post('/:idProjet', verifyToken, verifyChefAndAdjoint, tacheController.createTache);

// Get all taches
router.get('/', verifyAdmin, tacheController.getAllTaches);

// Get tache by ID
router.get('/:id', verifyToken, tacheController.getTacheById);

// Get taches by project ID
router.get('/projet/:idProjet', verifyToken, tacheController.getTacheByProjetId);

// Get tasks by user project tasks
router.get('/user/:idProjet', verifyToken, tacheController.getTasksByUserId);
// Get all user tasks
router.get('/userTasks/all',verifyToken,tacheController.getAllUserTasks);

// Update tache by ID
router.put('/:idProjet/:id', verifyToken, verifyChefAndAdjoint, tacheController.updateTacheById); 

// Update task status
router.patch('/statut/:id', verifyToken, tacheController.updateStatut);

// Delete tache by ID
router.delete('/:idProjet/:id', verifyToken, verifyChefAndAdjoint, tacheController.deleteTacheById);

module.exports = router;
