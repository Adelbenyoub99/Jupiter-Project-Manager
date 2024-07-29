const { Participation } = require('../models');
const jwt =require("jsonwebtoken");
const verifyChefAndAdjoint = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY;
  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;
    const projectId = req.params.idProjet; 
    console.log("id projet:"+projectId);
    const participation = await Participation.findOne({
      where: {
        idUtilisateur: userId,
        idProjet: projectId,
        role: ['ChefProjet', 'Adjoint']
      }
    });

    if (!participation) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    console.log("verify chef or adjoint passed ")
    next();
  } catch (error) {
    console.error('Error verifying ChefProjet or Adjoint role:', error);
    res.status(500).json({ message: 'Erreur serveur interne' });
  }
};

module.exports = verifyChefAndAdjoint;