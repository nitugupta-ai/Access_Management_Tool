const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized. No token provided." });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden. Invalid token." });
  
    console.log("Decoded User:", user);  //  Debugging line
  
    req.user = user;
    next();
  });
  
};

module.exports = authenticateToken;
