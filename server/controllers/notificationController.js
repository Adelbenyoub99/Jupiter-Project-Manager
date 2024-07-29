const { Notification, User ,Projet} = require('../models');
const { io } = require('../app'); 
const { where } = require('sequelize');

// Crée une notification
exports.createNotif = async (notificationData) => {
    const { titreNotif, contenuNotif, idUtilisateur, idProjet } = notificationData;

    try {
        // Vérifiez si l'utilisateur existe
        const user = await User.findByPk(idUtilisateur);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        // Créer la notification
        const notification = await Notification.create({
            titreNotif,
            contenuNotif,
            idUtilisateur, 
            idProjet
        });
      
        io.emit('notification', notification); 
     
        return notification;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Récupère toutes les notifications par identifiant utilisateur
exports.getAllNotifByIdUser = async (req, res) => {
    const idUtilisateur = req.user.userId; /// from token
    try {
         
        const notifications = await Notification.findAll({
            where: { idUtilisateur },
            include:[
                {model:Projet , attributes :['URL']}
             ]

        });

        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.deleteNotificationById = async (req, res) => {
    const idUtilisateur = req.user.userId;
    const { idNotif } = req.params;
  
    try {
      // Find the notification to ensure it belongs to the user
      const notification = await Notification.findOne({ idNotif: idNotif, idUtilisateur: idUtilisateur });
  
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      // Delete the notification
      await Notification.destroy({where:{idNotif}})
  
      return res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error deleting notification:', error); 
      return res.status(500).json({ message: 'An error occurred while deleting the notification' });
    }
  };