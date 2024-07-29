const { Message, User, Projet } = require('../models');
const { Op } = require('sequelize');
const xss = require('xss');

// Create a new message
exports.createMessage = async (req, res) => {
    const idUtilisateur = req.user.userId;
    const { idProjet } = req.params;
    try {
        const {contenuMsg} = req.body;
        console.log(contenuMsg)
        // Validate and sanitize the message content
        const sanitizedContent = xss(contenuMsg);
        const newMessage = await Message.create({ 
            contenuMsg: sanitizedContent,
            idUtilisateur,
            idProjet,
            dateEnvoi: new Date()
        });

        const message = await Message.findOne({
            where: {idMsg: newMessage.idMsg },
            include: [{ model: User, attributes: [ 'nomUtilisateur','image'] }]
                  
        });

        res.status(201).json(message);
    } catch (error) { 
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// Delete message by ID
exports.deleteMessageById = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Message.destroy({
            where: { idMsg: id }
        });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('Message not found');
    } catch (error) {
        console.error('Error deleting message by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get messages by user ID
exports.getMessageByUser = async (req, res) => {
    const idUtilisateur = req.user.userId;
    const { idProjet } = req.params;
    try {
        const messages = await Message.findAll({
            where: {  idUtilisateur , idProjet },
            include: [{ model: User, attributes: [ 'nomUtilisateur','image'] }]
        });
        if (messages.length === 0) {
            return res.status(404).json({ message: 'No messages found for this user' });
        }
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error getting messages by user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get messages by project ID
exports.getMessageByIdProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const messages = await Message.findAll({
            where: { idProjet: projectId },
            include: [{ model: User, attributes: [ 'nomUtilisateur','image'] }]
        });
        if (messages.length === 0) {
            return res.status(404).json({ message: 'No messages found for this project' });
        }
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error getting messages by project ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
