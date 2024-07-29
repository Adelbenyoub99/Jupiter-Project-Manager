const { User, Participation, DemandeAdhesion, Projet } = require("../models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const process = require("process");
const logger = require("../utils/logger");
const uploadIMG = require("../middlewares/multerForIMG");
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const adminActivityLogger=require('../middlewares/adminActivityLogger')
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

// Fonction pour créer un nouvel utilisateur haché le mdp et image par default oui
exports.createUser = async (req, res) => {
  const { nomUtilisateur, email, nom, prenom, dateNaissance, numTel } =
    req.body;
  try {
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(req.body.motDePasse, 10);

    // Créer l'utilisateur avec l'image par défaut
    const user = await User.create({
      nomUtilisateur,
      motDePasse: hashedPassword,
      email,
      nom,
      prenom,
      image: "JupiterIcon.png",
    });

    // Créer un jeton JWT
    const token = jwt.sign(
      { userId: user.idUtilisateur, role: "user" },
      secretKey,
      { expiresIn: "24h" }
    );

    if(req.adminId){
         // Enregistrer l'activité  d'administrateur
  
   const action = 'Création d\'un compte';
   const descActivity = `Le compte de l\'utilisateur ${user.nomUtilisateur} est nouvellement ajouté `;
   const idAdmin = req.adminId;
   await adminActivityLogger(action, descActivity, idAdmin);
    }
    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fonction de login oui
exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Comparer les mots de passe hachés
    const passwordMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }
    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "compte suspendue" });
    }
    
    // Créer un jeton JWT
    const token = jwt.sign(
      { userId: user.idUtilisateur, role: "user" },
      secretKey,
      { expiresIn: "24h" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users oui
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
/// search user
exports.searchUsers=async(req,res)=>{
  const { term } = req.query; 
  try {
    const users = await User.findAll({
        where: {
            [Op.or]: [
                { nom: { [Op.like]: `%${term}%` } },
                { prenom: { [Op.like]: `%${term}%` } },
                { nomUtilisateur: { [Op.like]: `%${term}%` } }
            ]
        },
        attributes: ['idUtilisateur', 'nomUtilisateur', 'email', 'nom', 'prenom', 'numTel', 'descProfile', 'image']
    });

    // Répond avec les utilisateurs trouvés
    return res.status(200).json(users);
} catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
}
}


// Get user by ID oui
exports.getUserById = async (req, res) => {
  const idUtilisateur = req.user.userId;

  try {
    const user = await User.findByPk(idUtilisateur);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userWithImageUrl = {
      ...user.toJSON(),
      imageUrl: user.getImageUrl(),
    };
    res.status(200).json(userWithImageUrl);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Récupérer tous les projets d'un utilisateur où il est collaborateur oui
exports.getProjectUserColab = async (req, res) => {
  const { id } = req.params;
  try {
    const participations = await Participation.findAll({
      where: {
        idUtilisateur: id,
        role: "Collaborateur",
      },
    });

    if (!participations.length) {
      return res
        .status(404)
        .json({
          message: "No projects found for the user with role Collaborateur",
        });
    }
    res.status(200).json(participations);
  } catch (error) {
    console.error(
      "Error getting projects for user with role Collaborateur:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all projects where the user is ChefProjet oui
exports.getProjectUserChef = async (req, res) => {
  const { id } = req.params;
  try {
    const projetsChef = await Participation.findAll({
      where: {
        idUtilisateur: id,
        role: "ChefProjet",
      },
    });
    if (!projetsChef.length) {
      return res
        .status(404)
        .json({ message: "No projects found for this user as ChefProjet" });
    }

    res.status(200).json(projetsChef);
  } catch (error) {
    console.error("Error getting projects for user as ChefProjet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all projects of a user where the role is Adjoint oui
exports.getProjectUserAdjoint = async (req, res) => {
  const { id } = req.params;
  try {
    const projetsAdjoint = await Participation.findAll({
      where: {
        idUtilisateur: id,
        role: "Adjoint",
      },
    });
    if (!projetsAdjoint.length) {
      return res
        .status(404)
        .json({ message: "No projects found for this user as Adjoint" });
    }
    res.status(200).json(projetsAdjoint);
  } catch (error) {
    console.error("Error getting projects where user is Adjoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user by ID oui
exports.updateUserById = async (req, res) => {
    const idUtilisateur = req.user.userId;
    console.log("id user : " + idUtilisateur);
    console.log(req.body.nom);
  
    try {
      if (req.body.motDePasse) {
        req.body.motDePasse = await bcrypt.hash(req.body.motDePasse, 10);
      }
  
      const [affectedRows] = await User.update(
        { ...req.body },
        { where: { idUtilisateur: idUtilisateur } }
      );
  
      if (affectedRows > 0) {
        const updatedUser = await User.findByPk(idUtilisateur);
        const userWithImageUrl = {
          ...updatedUser.toJSON(),
          imageUrl: updatedUser.getImageUrl()
        };
        return res.status(200).json(userWithImageUrl);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user by ID:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  exports.updateUserIMGById = async (req, res) => {
    const idUtilisateur = req.user.userId;
    console.log("id user : " + idUtilisateur);
  
    try {
      let image;
      if (req.file) {
        
        image = req.file.filename;
        console.log('test 1 '+image)
      } else {
        image = req.body.image;

        console.log('test 2 '+image)
      }
  
      const [affectedRows] = await User.update(
        { image: image },
        { where: { idUtilisateur: idUtilisateur } }
      );
      if (affectedRows > 0) {
        const updatedUser = await User.findByPk(idUtilisateur);
        const userWithImageUrl = {
          ...updatedUser.toJSON(),
          imageUrl: updatedUser.getImageUrl()
        };
        return res.status(200).json(userWithImageUrl);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user image by ID:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  

// Delete user by ID oui
exports.deleteUserById = async (req, res) => {
  const id = req.user.userId;
  try {
    // Étape 1: Vérifier les participations en tant que "chefProjet"
    const participationsChefProjet = await Participation.findAll({
      where: {
        idUtilisateur: id,
        role: "ChefProjet",
      },
    });

    for (const participation of participationsChefProjet) {
      const adjoints = await Participation.findOne({
        where: {
          idProjet: participation.idProjet,
          role: "Adjoint",
        },
      });

      if (adjoints.length > 0) {
        const adjoint = adjoints[0]; // Prendre le premier adjoint
        await Projet.update(
          { idChefProjet: adjoint.idUtilisateur },
          {
            where: { idProjet: participation.idProjet },
          }
        );
        await Participation.update(
          { role: "ChefProjet" },
          {
            where: {
              idProjet: participation.idProjet,
              idUtilisateur: adjoint.idUtilisateur,
            },
          }
        );
      }

      await Participation.destroy({
        where: {
          idUtilisateur: id,
          idProjet: participation.idProjet,
        },
      });
    }

    // Étape 2: Supprimer les demandes d'adhésions
    await DemandeAdhesion.destroy({
      where: { idUtilisateur: id },
    });

    // Étape 3: Mettre à jour les attributs de l'utilisateur
    await User.update(
      {
        nomUtilisateur: "JPM User",
        email: "jpm@gmail.com",
        nom: "JPM",
        prenom: "User",
        dateNaissance: "",
        numTel: "",
        image:'anonymeUser.png'
      },
      {
        where: { idUtilisateur: id },
      }
    );

    return res.status(200).json({message: "acount deleted"});
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
/////// admin service/////////////////
exports.updateUserPSW = async (req, res) => {
  const {idUser} = req.params;
  console.log("id user : " + idUser);
  

  try {
    
    const  motDePasse = await bcrypt.hash('JPM', 10);
 

    const [affectedRows] = await User.update(
      { motDePasse :motDePasse },
      { where: { idUtilisateur: idUser } }
    );

    if (affectedRows > 0) {


      const updatedUser = await User.findByPk(idUser);
      const userWithImageUrl = {
        ...updatedUser.toJSON(),
        imageUrl: updatedUser.getImageUrl()
      };
   const action = 'Réinitialisation d\'un mot de passe ';
   const descActivity = `Le mot de passe de compte utilisateur ${updatedUser.nomUtilisateur} est réinitialié(JPM) `;
   const idAdmin = req.adminId;
   await adminActivityLogger(action, descActivity, idAdmin);
      return res.status(200).json(userWithImageUrl);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.inactiveUser = async (req, res) => {
  const {idUser} = req.params;
  
  try {
 
    await User.update(
      {
        isActive:false,
        image:'anonymeUser.png'
      },
      {
        where: { idUtilisateur: idUser },
      }
    );
   // Enregistrer l'activité  d'administrateur
   const user = await User.findByPk(idUser)
 const action = 'Désactivation d\'un compte';
 const descActivity = `Le compte de l\'utilisateur ${user.nomUtilisateur} est désactivé `;
 const idAdmin = req.adminId;
 await adminActivityLogger(action, descActivity, idAdmin);

    return res.status(200).json({message: "account disActivated"});
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.activateUser = async (req, res) => {
  const {idUser} = req.params;
  try {
 
    await User.update(
      {
        isActive:true,
       image: "JupiterIcon.png",
      },
      {
        where: { idUtilisateur: idUser },
      }
    );
   // Enregistrer l'activité  d'administrateur
   const user = await User.findByPk(idUser)
 const action = 'Activation d\'un compte';
 const descActivity = `Le compte de l\'utilisateur ${user.nomUtilisateur} est réactivé `;
 const idAdmin = req.adminId;
 await adminActivityLogger(action, descActivity, idAdmin);
    return res.status(200).json({message: "account Activated"});
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const crypto = require('crypto');


exports.forgotPasswordMailSender = async (req, res) => {
  const { email } = req.body;

  try {
    // Générer un token aléatoire
    const token = crypto.randomBytes(20).toString('hex');

    // Configuration du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Construction de l'URL de réinitialisation avec le token
    const resetLink = `http://localhost:3000/resetPSW/${token}`;

    // Construction de l'email à envoyer
    const mailOptions = {
      from: process.env.EMAIL_USER, // Remplacer avec ton email
      to: email,
      subject: 'Réinitialisation de mot de passe - Jupiter',
      text: `Bonjour,\n\nPour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : ${resetLink}`,
    };

    // Envoyer l'email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
        return res.status(500).json({ message: 'Erreur interne du serveur lors de l\'envoi de l\'email.' });
      } else {
        console.log('Email de réinitialisation envoyé:', info.response);
        return res.status(200).json({ message: 'Email de réinitialisation envoyé avec succès.' });
      }
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de mot de passe:', error);
    res.status(500).json({ message: 'Erreur interne du serveur lors de la réinitialisation de mot de passe.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body; 

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [affectedRows] = await User.update(
      { motDePasse: hashedPassword },
      { where: { email: email } }
    );

    if (affectedRows > 0) {
      const token = jwt.sign(
        { userId: user.idUtilisateur, role: "user" },
        secretKey,
        { expiresIn: "24h" }
      );
      return res.status(200).json({ user, token });
    } else {
      return res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe.' });
    }
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe :', error);
    return res.status(500).json({ message: 'Erreur interne du serveur lors de la réinitialisation du mot de passe.' });
  }
}
