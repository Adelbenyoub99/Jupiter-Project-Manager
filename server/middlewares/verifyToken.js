const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authtoken = req.headers.authorization;
  
  if (authtoken) {
    const token = authtoken.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid Token, accès interdit" });
    }
  } else {
    return res.status(401).json({ message: "Veuillez vous connecter" });
  }
}

module.exports = verifyToken;