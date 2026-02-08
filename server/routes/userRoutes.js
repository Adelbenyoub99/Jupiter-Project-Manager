const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const verifyChefAndAdjoint = require('../middlewares/verifyChefAndAdjoint');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyChef = require('../middlewares/verifyChef');
const uploadIMG = require('../middlewares/multerForIMG');
const { validateLogin, validateRegister, validateUserSearch, validateUserUpdate } = require('../validators/userValidator');
// Route de login avec validation
router.post('/login', validateLogin, userController.login);

// Créer un nouvel utilisateur avec validation
router.post('/register', validateRegister, userController.createUser);

// Obtenir tous les utilisateurs (accessible uniquement aux administrateurs)  v
//router.get('/', verifyAdmin, userController.getAllUsers);

// Get user by ID
router.get('/info', verifyToken, userController.getUserById);

// Get projects for a user where role is Collaborateur
router.get('/:id/collaborateur', verifyToken, userController.getProjectUserColab);

// Get all projects where the user is ChefProjet
router.get('/:id/chefprojet', verifyToken, userController.getProjectUserChef); 

// Get all projects where user is Adjoint
router.get('/:id/adjoint', verifyToken, userController.getProjectUserAdjoint);

// Update user by ID avec validation
router.put('/', verifyToken, validateUserUpdate, userController.updateUserById);
router.put('/img', verifyToken, uploadIMG.single('image'), userController.updateUserIMGById);

// Delete user by ID
router.delete('/', verifyToken, userController.deleteUserById);
// Recherche utilisateur avec validation
router.get('/searchUser', verifyToken, validateUserSearch, userController.searchUsers);

router.post('/resetPSW',userController.forgotPasswordMailSender)
router.put('/updatePSW',userController.resetPassword)
module.exports = router;
