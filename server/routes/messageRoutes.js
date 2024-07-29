const express = require('express');
const router = express.Router();
const messageController = require('../Controllers/messageController');
const verifyToken = require('../middlewares/verifyToken');


// Create a new message
router.post('/:idProjet',verifyToken, messageController.createMessage);



// Get messages by user ID
router.get('/user/:idProjet', verifyToken, messageController.getMessageByUser);

// Get messages by project ID
router.get('/project/:projectId', verifyToken, messageController.getMessageByIdProject);



// Delete message by ID
router.delete('/:id', verifyToken, messageController.deleteMessageById);

module.exports = router;
