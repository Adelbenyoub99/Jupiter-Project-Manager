const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');
const verifyToken = require('../middlewares/verifyToken');




// Route pour obtenir toutes les notifications d'un utilisateur par identifiant
router.get('/user', verifyToken, notificationController.getAllNotifByIdUser);
router.delete('/:idNotif',verifyToken,notificationController.deleteNotificationById);
module.exports = router;
