const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = () => {
  return (req, res, next) => {
    let decoded;
    try {
      let token = req.headers?.authorization?.split(" ")[1];
      if (token) {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      } else {
        return res
          .status(404)
          .json({ message: "No token found, please login again" });
      }
    } catch (error) {
      if (error.message === "jwt expired") {
        let refreshToken = req.headers?.refreshtoken?.split(" ")[1];
        decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
        if (decoded) {
          let newAccessToken = jwt.sign(
            {
              userId: decoded.userId,
              name: decoded.name,
              role: decoded.role,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: 60 * 15 }
          );
          res.setHeader("authorization", `Bearer ${newAccessToken}`)
        } else {
          return res
            .status(401)
            .json({ message: "Token expired, please login again." });
        }
      } else {
        return res
          .status(500)
          .json({ message: "Something went wrong, please try again later" });
      }
    }
    if (decoded) {
        req.user = decoded.userId;
        req.userName = decoded.name;
        next();
      } else {
        return res.status(401).json({ message: "Unauthorized access" });
      }
    } 
  };

module.exports={authMiddleware}