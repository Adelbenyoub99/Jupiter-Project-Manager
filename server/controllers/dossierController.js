const { Dossier, ProjetComposeDossier, DossierComposefichier, Fichier } = require('../models');

// Create a new dossier
exports.createDossier = async (req, res) => {
    try {
        const { nomDossier } = req.body;
        const dossier = await Dossier.create({ nomDossier });
        res.status(201).json(dossier);
    } catch (error) {
        console.error('Error creating dossier:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all dossiers
exports.getAllDossiers = async (req, res) => {
    try {
        const dossiers = await Dossier.findAll();
        res.status(200).json(dossiers);
    } catch (error) {
        console.error('Error getting dossiers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get dossier by ID
exports.getDossierById = async (req, res) => {
    const { id } = req.params;
    try {
        const dossier = await Dossier.findByPk(id, {
            include: [Fichier] // Include associated files
        });
        if (!dossier) {
            return res.status(404).json({ message: 'Dossier not found' });
        }
        res.status(200).json(dossier);
    } catch (error) {
        console.error('Error getting dossier by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update dossier by ID
exports.updateDossierById = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await Dossier.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedDossier = await Dossier.findByPk(id);
            return res.status(200).json(updatedDossier);
        }
        throw new Error('Dossier not found');
    } catch (error) {
        console.error('Error updating dossier by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete dossier by ID
exports.deleteDossierById = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete associated files from DossierComposefichier table
        await DossierComposefichier.destroy({
            where: { idDossier: id }
        });
        // Delete dossier from ProjetComposeDossier table
        await ProjetComposeDossier.destroy({
            where: { idDossier: id }
        });
        // Delete dossier
        const deleted = await Dossier.destroy({
            where: { id: id }
        });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('Dossier not found');
    } catch (error) {
        console.error('Error deleting dossier by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
