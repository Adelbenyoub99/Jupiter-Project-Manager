const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { Projet,Fichier,User,Participation } = require('../models');
const notificationController=require('./notificationController')
const Sequelize = require('sequelize');
const { Op } = require('sequelize'); 
const subfolders = {
'pdf': ['pdf'],
  'doc': ['doc', 'docx'],
  'ppt': ['ppt', 'pptx'],
  'zip': ['zip'],
  'txt': ['txt'],
  'images': ['png', 'jpg', 'jpeg', 'svg'],
  'videos': ['mp4', 'avi', 'mkv'],
  'code': ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'html', 'css'],
  'autre': [] 
};

/////////////////////// Fichiers ////////////////////////////////

// Déterminer le type de ressource pour Cloudinary
const getResourceType = (extension) => {
  const imageExtensions = ['png', 'jpg', 'jpeg', 'svg'];
  const videoExtensions = ['mp4', 'avi', 'mkv'];
  return imageExtensions.includes(extension) ? 'image' :
         videoExtensions.includes(extension) ? 'video' :
         'raw';
};


// Function to determine resource type based on file extension
const getResourceTypeToStore = (extension) => {
  for (const [type, extensions] of Object.entries(subfolders)) {
    if (extensions.includes(extension.toLowerCase())) {
      return type;
    }
  }
  return 'autre'; // Default to 'autre' for unknown file types
};
async function uploadFile(req, res) {
  const file = req.file;
  const { idProjet } = req.params;
  const idUtilisateur = req.user.userId;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const projet = await Projet.findByPk(idProjet);
    if (!projet) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const projectFolderName = idProjet+'_'+projet.nomProjet;
    const fileExtension = path.extname(file.originalname).slice(1);
    let targetSubfolder = 'default_uploads';

    // Rechercher le sous-dossier correspondant à l'extension du fichier
    for (const [folder, extensions] of Object.entries(subfolders)) {
      if (extensions.includes(fileExtension)) {
        targetSubfolder = folder;
        break;
      }
    }

    const resourceType = getResourceType(fileExtension);

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
      resource_type: resourceType,
      public_id: `${projectFolderName}/${targetSubfolder}/${file.originalname}`
    };

    const tempFilePath = path.join(__dirname, '..', 'uploads', file.filename);

    const result  = await cloudinary.uploader.upload(tempFilePath, options);
    fs.unlinkSync(tempFilePath);

    const fichier = await Fichier.create({
      idProjet,
      idUtilisateur,
      nomFichier: req.file.originalname,
      publicId: result.public_id,
      url: result.secure_url,
      Type: getResourceTypeToStore(fileExtension),
      folder: result.folder
    });
    const createdFile = await Fichier.findByPk(fichier.idFichier, {
      include: { model: User, attributes: ['nomUtilisateur', 'nom', 'prenom', 'image'] }
    });

    //  creation d'une notification
    const membres = await Participation.findAll({
      where: { idProjet } });
      const uploader = await User.findByPk(idUtilisateur);
      const titreNotif = 'Nouveau fichier ajouté';
      const contenuNotif = `${uploader.nom} ${uploader.prenom} a ajouté un nouveau fichier au projet ${projet.nomProjet}.`;
      for (const membre of membres) {
        if (membre.idUtilisateur !== idUtilisateur) {
            const notificationData = {
                titreNotif,
                contenuNotif,
                idUtilisateur: membre.idUtilisateur,
                idProjet: idProjet
            };
            await notificationController.createNotif(notificationData);
        }
    }
    res.status(201).json(createdFile);
   

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
////////////get all project files///////////////
async function getAllFiles(req, res) {
  const { idProjet } = req.params;

  try {
    // Récupérer les fichiers associés au projet depuis la base de données
    const fichiers = await Fichier.findAll({
      where: { idProjet },
      include: { model: User, attributes: ['nomUtilisateur', 'nom', 'prenom','image'] }
    });

    res.json(fichiers);
  } catch (error) {
    console.error('Error retrieving all files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
//////////////get file by type//////////////
async function getFiles(req, res) {
  const { idProjet, type } = req.params;

  try {
    // Query database to get files of a specific type
    const files = await Fichier.findAll({
      where: {
        idProjet,
        Type: type // Filter files by the specified type
      },
      include: { model: User, attributes: ['nomUtilisateur', 'nom', 'prenom','image'] }
    });

    res.json(files);
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
//////////////////Recherrche fichier////////////////////
async function searchFilesByName(req, res) {
  const { idProjet } = req.params;
  const { term } = req.query;

  try {
    // Recherche des fichiers par nom dans la base de données
    const fichiers = await Fichier.findAll({
      where: {
        idProjet,
        nomFichier: {
          [Op.like]: `%${term}%`, // Searching for partial matches
        },
      },
      include: { model: User, attributes: ['nomUtilisateur', 'nom', 'prenom','image'] }
    });

    res.json(fichiers);
  } catch (error) {
    console.error('Error searching files by name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

////renommer un fichier chef et adjoint////////////
async function renameFile(req, res) {
  const {  fileId } = req.params;
  const { newName } = req.body;

  try {
    // Récupérer les informations du fichier depuis la base de données
    const fichier = await Fichier.findByPk(fileId);
    if (!fichier) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Renommer le fichier dans la base de données uniquement
    const fileExtension = path.extname(fichier.nomFichier); // Get the current file extension
    const fileNameWithoutExtension = path.basename(newName, fileExtension); // Get the file name without extension
    const newFileName = `${fileNameWithoutExtension}${fileExtension}`; //

    fichier.nomFichier = newFileName;
    await fichier.save();

    const renamedfichier = await Fichier.findByPk(fileId);

    res.json({ message: 'File renamed successfully', file: renamedfichier });
  } catch (error) {
    console.error('Error renaming file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function deleteFile(req, res) {
  const { idProjet, fileId } = req.params;

  if (!fileId) {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    // Vérifier l'existence du projet
    const projet = await Projet.findByPk(idProjet);
    if (!projet) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Récupérer les informations du fichier depuis la base de données
    const fichier = await Fichier.findByPk(fileId);
    if (!fichier) {
      return res.status(404).json({ error: 'File not found in database' });
    }

    const cloudinaryResult = await cloudinary.uploader.destroy(fichier.publicId);

    
    if (cloudinaryResult.result === 'ok') {
      
      await fichier.destroy();

      res.json({ message: 'File deleted successfully' });
    } else {
      
      await fichier.destroy();

      res.json({ message: 'File deleted from database (Cloudinary deletion ignored)' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



module.exports = {
  uploadFile,
  getAllFiles,
  getFiles,
  searchFilesByName,
  renameFile,
  deleteFile,
 
};