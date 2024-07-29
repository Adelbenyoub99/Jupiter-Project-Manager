const { Fichier, Dossier, User } = require('../models');

// Create a new file
exports.createFichier = async (req, res) => {
    try {
        const { nomFichier, idUtilisateur } = req.body;
        const fichier = await Fichier.create({ nomFichier, idUtilisateur });
        res.status(201).json(fichier);
    } catch (error) {
        console.error('Error creating file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all files
exports.getAllFichiers = async (req, res) => {
    try {
        const fichiers = await Fichier.findAll();
        res.status(200).json(fichiers);
    } catch (error) {
        console.error('Error getting files:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get file by ID
exports.getFichierById = async (req, res) => {
    const { id } = req.params;
    try {
        const fichier = await Fichier.findByPk(id, {
            include: [
                { model: Dossier, through: DossierComposefichier },
                { model: User }
            ]
        });
        if (!fichier) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.status(200).json(fichier);
    } catch (error) {
        console.error('Error getting file by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update file by ID
exports.updateFichierById = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await Fichier.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedFichier = await Fichier.findByPk(id);
            return res.status(200).json(updatedFichier);
        }
        throw new Error('File not found');
    } catch (error) {
        console.error('Error updating file by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete file by ID
exports.deleteFichierById = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete file from DossierComposefichier table
        await DossierComposefichier.destroy({
            where: { idFichier: id }
        });
        // Delete file
        const deleted = await Fichier.destroy({
            where: { id: id }
        });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('File not found');
    } catch (error) {
        console.error('Error deleting file by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
