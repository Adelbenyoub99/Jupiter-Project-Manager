const { Admin, AdminActivity } = require('../models');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const process = require('process');
const logger = require('../utils/logger');
const adminActivityLogger=require('../middlewares/adminActivityLogger')
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

// Create a new admin avec un token JWT et hacher le mdp oui
exports.createAdmin = async (req, res) => {
    const { nomAdmin, motDePasse } = req.body;
    if (!nomAdmin || !motDePasse) {
        return res.status(400).json({ message: 'NomAdmin and MotDePasse are required' });
    }

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        // Create the admin with the hashed password
        const newAdmin = await Admin.create({
            nomAdmin,
            motDePasse: hashedPassword
        });
    // Créer un jeton JWT
    const token = jwt.sign({ adminId: newAdmin.idAdmin, role: 'admin' }, secretKey, { expiresIn: '24h' });

          // Enregistrer l'activité de création d'administrateur
          const action = 'Création d\'admin';
          const descActivity = `Un nouveau compte administrateur est ajouté (${newAdmin.nomAdmin}) `;
          const idAdmin = req.adminId;
          await adminActivityLogger(action, descActivity, idAdmin);



    res.status(201).json({ newAdmin, token });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fonction de login pour Admin oui
exports.loginAdmin = async (req, res) => {
    const { nomAdmin, motDePasse } = req.body;
    try {
        const admin = await Admin.findOne({ where: { nomAdmin } });
        if (!admin) {
            return res.status(401).json({ message: 'Nom d\'administrateur ou mot de passe incorrect' });
        }

        // Compare the hashed password using bcrypt
        const isPasswordValid = await bcrypt.compare(motDePasse, admin.motDePasse);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Nom d\'administrateur ou mot de passe incorrect' });
        }

        const token = jwt.sign({ adminId: admin.idAdmin, role: 'admin' }, secretKey, { expiresIn: '24h' });
        res.status(200).json({ admin, token });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all admins oui
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error getting admins:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllAdminActivities=async(req,res)=>{
    try {
        
        const activities = await AdminActivity.findAll({
            include: [{
                model: Admin,
                attributes: ['nomAdmin']
            }]
        });
        res.status(200).json(activities);
        
    } catch (error) {
        console.error('Error during admin activity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// Get admin by ID oui
exports.getAdminById = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        console.error('Error getting admin by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update admin by ID  oui
exports.updateAdminById = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.motDePasse) {
            req.body.motDePasse = await bcrypt.hash(req.body.motDePasse, 10);
        }
        const [updated] = await Admin.update(req.body, {
            where: { idAdmin: id }
        });
        if (updated) {
            const updatedAdmin = await Admin.findByPk(id);
            return res.status(200).json(updatedAdmin);
        }
        throw new Error('Admin not found');
    } catch (error) {
        console.error('Error updating admin by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete admin by ID oui
exports.deleteAdminById = async (req, res) => {
    const { id } = req.params;
    const admin =  await Admin.findByPk(id);
    try {
        const deleted = await Admin.destroy({
            where: { idAdmin: id }
        });
        if (deleted) {
             // Enregistrer l'activité de création d'administrateur
             
          const action = 'Suppression d\'admin';
          const descActivity = `Un  compte administrateur est supprimé (${admin.nomAdmin}) `;
          const idAdmin = req.adminId;
          await adminActivityLogger(action, descActivity, idAdmin);

            return res.status(201).json({message:"admin supprimé"});
           

        }
        throw new Error('Admin not found');
    } catch (error) {
        console.error('Error deleting admin by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.isSuperAdmin = async (req, res) => {
    try {
        const idAdmin = req.adminId;
        
        const admin = await Admin.findByPk(idAdmin);

    
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        if (admin.isSuperAdmin) {
            return res.status(200).json({ success: true, isSuperAdmin: true });
        } else {
            return res.status(200).json({ success: true, isSuperAdmin: false });
        }
    } catch (error) {
        console.error('Error verifying super admin:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};