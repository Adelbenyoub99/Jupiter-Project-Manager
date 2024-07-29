const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Charger la clé secrète à partir des variables d'environnement
const secretKey = process.env.JWT_SECRET_KEY;

// Middleware d'authentification
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token invalide' });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Aucun token fourni' });
  }
};

// Middleware d'autorisation
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
