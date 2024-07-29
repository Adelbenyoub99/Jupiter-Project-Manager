const express = require('express');
const router = express.Router();
const projetController = require('../Controllers/projetController');
const cloudinaryController = require('../Controllers/fichiersController');
const verifyToken = require('../middlewares/verifyToken');
const verifyChefAndAdjoint = require('../middlewares/verifyChefAndAdjoint');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyChef = require('../middlewares/verifyChef');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

// Routes de gestion de fichiers
router.post('/:idProjet/upload', verifyToken, upload.single('file'), cloudinaryController.uploadFile);
router.get('/:idProjet/all',verifyToken,cloudinaryController.getAllFiles);
router.get('/type/:idProjet/:type', verifyToken, cloudinaryController.getFiles);

// Route for searching files by name
router.get('/search/:idProjet', verifyToken, cloudinaryController.searchFilesByName);
router.put('/:idProjet/:fileId', verifyToken,verifyChefAndAdjoint, cloudinaryController.renameFile);
// router.post('/file/move', cloudinaryController.moveFile);
router.delete('/:idProjet/:fileId', verifyToken,verifyChefAndAdjoint, cloudinaryController.deleteFile);




module.exports = router;

