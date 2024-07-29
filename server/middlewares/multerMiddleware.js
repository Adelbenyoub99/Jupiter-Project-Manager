const multer = require('multer');
const path = require('path');

// Configuration de l'emplacement de stockage et du nom de fichier
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Conserver le nom d'origine
  }
});

// Filtrer les fichiers pour s'assurer qu'ils sont des types autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/svg+xml'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, ZIP, TXT, PNG, JPG, and SVG are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Limite de taille de fichier à 10MB
  fileFilter: fileFilter
});

module.exports = upload;
