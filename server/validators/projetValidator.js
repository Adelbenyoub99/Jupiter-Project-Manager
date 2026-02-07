const { body, param, validationResult } = require('express-validator');

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

// Validation pour la création de projet
const validateCreateProject = [
  body('nomProjet')
    .trim()
    .notEmpty()
    .withMessage('Nom du projet requis')
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom du projet doit contenir entre 3 et 100 caractères'),
  body('descProjet')
    .trim()
    .notEmpty()
    .withMessage('Description du projet requise')
    .isLength({ max: 500 })
    .withMessage('La description ne doit pas dépasser 500 caractères'),
  body('visibiliteProjet')
    .isIn(['Public', 'Privé'])
    .withMessage('Visibilité invalide (Public ou Privé)'),
  body('delaiProjet')
    .optional()
    .isISO8601()
    .withMessage('Date de délai invalide'),
  handleValidationErrors
];

// Validation pour la mise à jour de projet
const validateUpdateProject = [
  param('idProjet')
    .isInt()
    .withMessage('ID de projet invalide'),
  body('nomProjet')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom du projet doit contenir entre 3 et 100 caractères'),
  body('descProjet')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne doit pas dépasser 500 caractères'),
  body('visibiliteProjet')
    .optional()
    .isIn(['Public', 'Privé'])
    .withMessage('Visibilité invalide (Public ou Privé)'),
  handleValidationErrors
];

// Validation pour l'ID de projet
const validateProjectId = [
  param('idProjet')
    .isInt()
    .withMessage('ID de projet invalide'),
  handleValidationErrors
];

module.exports = {
  validateCreateProject,
  validateUpdateProject,
  validateProjectId,
  handleValidationErrors
};
