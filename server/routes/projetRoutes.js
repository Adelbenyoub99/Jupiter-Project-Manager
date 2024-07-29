const express = require('express');
const router = express.Router();
const projetController = require('../Controllers/projetController');
const cloudinaryController = require('../Controllers/fichiersController');
// Get all public projects
router.get('/publics', projetController.getPublicProjects)

// recherech projet public
router.get('/publics/recherche',projetController.searchPublicProject)



const verifyToken = require('../middlewares/verifyToken');
const verifyChefAndAdjoint = require('../middlewares/verifyChefAndAdjoint');
const verifyAdmin = require('../middlewares/verifyAdmin');

const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

// get user public project/////////////////

router.get('/userPublicProject',verifyToken,projetController.getUserPublicProject)
// get user  project/////////////////

router.get('/userProject',verifyToken,projetController.getUserProject)

// Créer un nouveau projet
router.post('/', verifyToken, projetController.createProject);

// Get all projets
//router.get('/', verifyAdmin, projetController.getAllProjets);

// Get projet by ID
router.get('/infoProject/:idProjet', verifyToken, projetController.getProjetById);
//Get project by URL
router.get('/url/:url', verifyToken, projetController.getProjectByUrl)
router.get('/sharedUrl/:url', verifyToken, projetController.getByUrl)
// Route pour récupérer l'URL d'un projet par son ID
router.get('/:idProjet/url', verifyToken, projetController.getProjectUrl);
//Get project members by project ID
router.get('/:projectId/members', projetController.getProjectMembers);

const verifyChef = require('../middlewares/verifyChef');
// Update projet by ID 
router.put('/:idProjet', verifyToken, verifyChef, projetController.updateProjetById);

// Delete projet by ID 
router.delete('/:idProjet', verifyToken, verifyChef, projetController.deleteProjetById);



module.exports = router;
