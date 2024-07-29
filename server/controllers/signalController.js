const { Signal,User } = require('../models');
const adminActivityLogger=require('../middlewares/adminActivityLogger')
// Create a new signal
exports.createSignal = async (req, res) => {
    const idUtilisateur = req.user.userId; 
    const {  descSignal, nomProjet, nomUtilisateur, typeSignal } = req.body;

    try {
        const signal = await Signal.create({
            descSignal,
            nomProjet,
            nomUtilisateur,
            typeSignal,
            idUtilisateur,
            
        });
        res.status(201).json(signal);
    } catch (error) {
        console.error('Error creating signal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
//Get user signals////

exports.getSignalsByUserId = async (req, res) => {
    const userId = req.user.userId;  
    try {
        const signals = await Signal.findAll({
            where: {
                idUtilisateur: userId
            }
        });

        if (signals.length === 0) {
            return res.status(404).json({ message: 'Aucun signal trouvé pour cet utilisateur.' });
        }

        res.status(200).json(signals);
    } catch (error) {
        console.error('Erreur lors de la récupération des signaux de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

// Get all signals
exports.getAllSignals = async (req, res) => {
    try {
        const signals = await Signal.findAll({
            include: {
                model: User,
                attributes: ['nomUtilisateur', 'image'] 
            }
        });
        res.status(200).json(signals);
    } catch (error) {
        console.error('Error getting signals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get signal by ID
exports.getSignalById = async (req, res) => {
    const { id } = req.params;
    try {
        const signal = await Signal.findByPk(id);
        if (!signal) {
            return res.status(404).json({ message: 'Signal not found' });
        }
        res.status(200).json(signal);
    } catch (error) {
        console.error('Error getting signal by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update signal by ID
exports.updateSignalById = async (req, res) => {
    const { idSignal } = req.params;
    try {
        const [updated] = await Signal.update(req.body, {
            where: { idSignal: idSignal }
        });
        if (updated) {
            const updatedSignal = await Signal.findByPk(idSignal);
             // Enregistrer l'activité  d'administrateur
            const action = 'Traitement d\'un signalement';
            const descActivity = `un signalement de ${updatedSignal.typeSignal} est traité `;
            const idAdmin = req.adminId;
            await adminActivityLogger(action, descActivity, idAdmin);

            return res.status(200).json(updatedSignal);
        }
        throw new Error('Signal not found');
    } catch (error) {
        console.error('Error updating signal by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete signal by ID
exports.deleteSignalById = async (req, res) => {
    const { idSignal } = req.params;
    const signal= await Signal.findByPk(idSignal) 
    try {
        // Delete signal
        const deleted = await Signal.destroy({
            where: { idSignal: idSignal }
        });
        if (deleted) {
           
 // Enregistrer l'activité  d'administrateur
 const action = 'Suppression d\'un signalement';
 const descActivity = `un signalement de ${signal.typeSignal} est supprimé `;
 const idAdmin = req.adminId;
 await adminActivityLogger(action, descActivity, idAdmin);

 return res.status(201).json({message:"signal supprimer"});
        
        }
        throw new Error('Signal not found');
    } catch (error) {
        console.error('Error deleting signal by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
