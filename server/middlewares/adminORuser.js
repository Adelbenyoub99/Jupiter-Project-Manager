const jwt =require("jsonwebtoken");
const getRole = async (req, res) => {
  
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = req.headers.authorization.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY;
  try {
    const decoded = jwt.verify(token, secretKey);
    const role = decoded.role;
    
    res.status(201).json(role);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = getRole;

