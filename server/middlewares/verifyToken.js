const jwt =require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authtoken = req.headers.authorization;
  console.log("Token:", authtoken);
  console.log( req.params)
  if (authtoken) {
    const token = authtoken.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decodedToken;
      console.log("got the user id ok"+ decodedToken.userId)
      next();
    } catch (error) {
      throw new Error("Invalid Token , acces Interdit");
    }
  } else {
    throw new Error("veuillez se connecter");
  }
}
module.exports = verifyToken;