const { body, query, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Erreur de validation',
      errors: errors.array() 
    });
  }
  next();
};

// Validation pour le login
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('motDePasse')
    .notEmpty()
    .withMessage('Mot de passe requis')
    .isLength({ min: 3 })
    .withMessage('Le mot de passe doit contenir au moins 3 caractères'),
  handleValidationErrors
];

// Validation pour l'inscription
const validateRegister = [
  body('nomUtilisateur')
    .trim()
    .notEmpty()
    .withMessage('Nom d\'utilisateur requis')
    .isLength({ min: 3, max: 50 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('motDePasse')
    .notEmpty()
    .withMessage('Mot de passe requis')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('nom')
    .trim()
    .notEmpty()
    .withMessage('Nom requis')
    .isLength({ max: 50 })
    .withMessage('Le nom ne doit pas dépasser 50 caractères'),
  body('prenom')
    .trim()
    .notEmpty()
    .withMessage('Prénom requis')
    .isLength({ max: 50 })
    .withMessage('Le prénom ne doit pas dépasser 50 caractères'),
  body('email')
    .custom((value) => {
      // Vérifier que l'email n'est pas déjà utilisé sera fait dans le controller
      return true;
    }),
  handleValidationErrors
];

// Validation pour la recherche d'utilisateurs
const validateUserSearch = [
  query('term')
    .trim()
    .notEmpty()
    .withMessage('Terme de recherche requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le terme de recherche doit contenir entre 2 et 100 caractères'),
  handleValidationErrors
];

// Validation pour la mise à jour d'utilisateur
const validateUserUpdate = [
  body('nomUtilisateur')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('motDePasse')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('nom')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Le nom ne doit pas dépasser 50 caractères'),
  body('prenom')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Le prénom ne doit pas dépasser 50 caractères'),
  body('numTel')
    .optional()
    .isNumeric()
    .withMessage('Numéro de téléphone invalide'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateRegister,
  validateUserSearch,
  validateUserUpdate,
  handleValidationErrors
};
