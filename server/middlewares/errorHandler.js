const logger = require('../utils/logger');

// Middleware de gestion globale des erreurs
const errorHandler = (err, req, res, next) => {
  // Log l'erreur
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Erreur de validation JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token invalide',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Erreur d'expiration JWT
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expiré',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Erreur Sequelize (base de données)
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Erreur de validation des données',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Cette valeur existe déjà',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      message: 'Erreur de base de données',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Erreur de syntaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'JSON invalide dans la requête'
    });
  }

  // Erreur personnalisée avec status
  if (err.status) {
    return res.status(err.status).json({
      message: err.message || 'Une erreur est survenue',
      error: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }

  // Erreur par défaut (500)
  res.status(500).json({
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Middleware pour gérer les routes non trouvées (404)
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Route non trouvée',
    path: req.originalUrl
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
