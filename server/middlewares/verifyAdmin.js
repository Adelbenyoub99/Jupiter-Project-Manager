const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

// Middleware pour vérifier si l'utilisateur est un admin
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token invalide' });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé: Admin seulement' });
      }
 
     // console.log(user.adminId)
      req.adminId = user.adminId;
      next();
    });
  } else {
    res.status(401).json({ message: 'Aucun token fourni' });
  }
};

module.exports = verifyAdmin;
