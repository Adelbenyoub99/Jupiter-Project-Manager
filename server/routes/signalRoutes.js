const express = require('express');
const router = express.Router();
const signalController = require('../Controllers/signalController');
const verifyToken = require('../middlewares/verifyToken');
const verifyChefAndAdjoint = require('../middlewares/verifyChefAndAdjoint');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyChef = require('../middlewares/verifyChef');

// Create a new signal
router.post('/', verifyToken, signalController.createSignal);
//Get user signals
router.get('/user',verifyToken,signalController.getSignalsByUserId);

// Get all signals
router.get('/', verifyAdmin, signalController.getAllSignals);

// Get signal by ID
router.get('/:id', verifyToken, signalController.getSignalById);

// Update signal by ID
router.put('/:id', verifyToken, signalController.updateSignalById);

// Delete signal by ID
router.delete('/:id', verifyToken, signalController.deleteSignalById);

module.exports = router;
