const express = require('express');
const router = express.Router();
const participerController = require('../Controllers/participerController');
const verifyToken = require('../middlewares/verifyToken');
const verifyChefAndAdjoint = require('../middlewares/verifyChefAndAdjoint');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyChef = require('../middlewares/verifyChef');

// Create a new participation (only ChefProjet or Adjoint can create)
router.post('/:idProjet', verifyToken, verifyChef, participerController.createParticipation);
router.post('/addMembre/:idProjet', verifyToken, verifyChef, participerController.createMembre);
router.post('/share/:idProjet',verifyToken,participerController.createFromSharedUrl);
// Get all participations (accessible to all authenticated users)
//router.get('/', verifyAdmin, participerController.getAllParticipations);

// Get participation by ID
//router.get('/:id', verifyToken, participerController.getParticipationById);
//get project participation or memebres
router.get('/:idProjet',verifyToken,participerController.getProjectParticipation);

     
// Update role from Collaborateur to Adjoint 
router.put('/updateToAd/:idProjet/:idUtilisateur', verifyToken, verifyChef, participerController.updateRoleColabToAdjoint);

// Update role from Adjoint to Collaborateur 
router.put('/updateToCol/:idProjet/:idUtilisateur', verifyToken, verifyChef, participerController.updateRoleAdjointToColab);

// Delete participation by ID 
router.delete('/membre/:idProjet/:id', verifyToken, verifyChef, participerController.deleteParticipationById);

router.delete('/quitter/:idProjet', verifyToken, participerController.deleteParticipation);

module.exports = router;