
const AdminActivity = require('../models/adminActivity');
const Admin =require('../models/admin')
const adminActivityLogger = async (action, descActivity, idAdmin) => {
    try {
        // Créer une nouvelle activité admin dans la base de données
        await AdminActivity.create({
            action,
            descActivity,
            idAdmin
        });
        console.log('Admin activity logged successfully');
    } catch (error) {
        console.error('Error logging admin activity:', error);
        throw error; // Vous pouvez gérer les erreurs selon vos besoins
    }
};
const getAllAdminActivities = async () => {
    try {
        // Récupérer toutes les activités admin de la base de données
        const activities = await AdminActivity.findAll();
        return activities;
    } catch (error) {
        console.error('Error fetching admin activities:', error);
        throw error; // Vous pouvez gérer les erreurs selon vos besoins
    }
};
module.exports = adminActivityLogger
