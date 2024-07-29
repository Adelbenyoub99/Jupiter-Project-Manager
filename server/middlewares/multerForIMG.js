const multer = require('multer');
const path = require('path');

// Configuration de multer pour enregistrer les fichiers dans le dossier 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploadsIMG/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier avec un timestamp
  }
});

const uploadIMG = multer({ storage });

module.exports = uploadIMG;
