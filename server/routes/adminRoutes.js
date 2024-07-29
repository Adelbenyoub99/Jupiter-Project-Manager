const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const verifyAdmin = require('../middlewares/verifyAdmin');
const userController= require('../Controllers/userController')
const projetController=require('../Controllers/projetController')
const signalController= require('../Controllers/signalController')
const participerController= require('../Controllers/participerController')
const adminActivityLogger=require('../middlewares/adminActivityLogger')
// Route de login pour Admin
router.post('/login', adminController.loginAdmin);

// Create a new admin
router.post('/create',verifyAdmin, adminController.createAdmin);

// Get all admins
router.get('/admins', verifyAdmin, adminController.getAllAdmins);

// Get admin by ID
router.get('/admins/:id', verifyAdmin, adminController.getAdminById);

// Update admin by ID
router.put('/:id', verifyAdmin, adminController.updateAdminById);

// Delete admin by ID
router.delete('/:id', verifyAdmin, adminController.deleteAdminById);
// get if admin is super

router.get('/isSuper',verifyAdmin,adminController.isSuperAdmin)
///// admin users managment routes
router.get('/users',verifyAdmin,userController.getAllUsers)
router.get('/searchUsers',verifyAdmin,userController.searchUsers)
router.post('/creatUser',verifyAdmin,userController.createUser)
router.put('/updatePSW/:idUser',verifyAdmin,userController.updateUserPSW)
router.put('/inactiveUser/:idUser',verifyAdmin,userController.inactiveUser)
router.put('/activeUser/:idUser',verifyAdmin,userController.activateUser)
router.get('/participations',verifyAdmin,participerController.getAllParticipations)
//// admin project managment routes 
router.get('/projets',verifyAdmin,projetController.getAllProjets),
router.delete('/suprimerProjet/:idProjet',verifyAdmin,projetController.deleteProjetByAdmin)
router.get('/projectMembers/:projectId',verifyAdmin,projetController.getProjectMembers)
router.get('/projets/search',verifyAdmin,projetController.searchProject)

//// admin signalement routes
router.get('/signals',verifyAdmin,signalController.getAllSignals)
router.put('/repondreAuSignal/:idSignal',verifyAdmin,signalController.updateSignalById)
router.delete('/deleteSignal/:idSignal',verifyAdmin,signalController.deleteSignalById)
router.get('/activity',verifyAdmin,adminController.getAllAdminActivities)

module.exports = router;
