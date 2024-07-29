const express = require('express');
const router = express.Router();
const assignerController = require('../Controllers/assignerController');
const verifyToken = require('../middlewares/verifyToken');
const verifyChefAndAdjoint = require('../middlewares/verifyChefAndAdjoint');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyChef = require('../middlewares/verifyChef');

// Create a new assignation
router.post('/:idProjet', verifyToken, verifyChefAndAdjoint, assignerController.createAssignation);

// Get all assignations
router.get('/', verifyAdmin, assignerController.getAllAssignations);

// Get assignation by ID
router.get('/:id', verifyToken, assignerController.getAssignationById);


// Delete assignation by ID
router.delete('/:idProjet/:idUtilisateur/:idTache', verifyToken, verifyChefAndAdjoint, assignerController.deleteAssignationById);

module.exports = router;
