const jwt = require("jsonwebtoken");
require("dotenv").config();

const getSecretKey = () => process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'taskpulse_secret_2026';

const authMiddleware = () => {
  return (req, res, next) => {
    let decoded;
    const secretKey = getSecretKey();

    try {
      let token = req.headers?.authorization?.split(" ")[1];
      if (token) {
        decoded = jwt.verify(token, secretKey);
      } else {
        return res
          .status(401)
          .json({ message: "No token found, please login again" });
      }
    } catch (error) {
      if (error.message === "jwt expired") {
        let refreshToken = req.headers?.refreshtoken?.split(" ")[1];
        if (refreshToken) {
          try {
            decoded = jwt.verify(refreshToken, secretKey);
            if (decoded) {
              let newAccessToken = jwt.sign(
                {
                  userId: decoded.userId,
                  name: decoded.name,
                  role: decoded.role,
                },
                secretKey,
                { expiresIn: 60 * 60 * 8 }
              );
              res.setHeader("authorization", `Bearer ${newAccessToken}`);
            }
          } catch {
            return res
              .status(401)
              .json({ message: "Token expired, please login again." });
          }
        } else {
          return res
            .status(401)
            .json({ message: "Token expired, please login again." });
        }
      } else {
        return res
          .status(401)
          .json({ message: "Invalid or unauthorized token." });
      }
    }

    if (decoded) {
      req.user = decoded.userId;
      req.userName = decoded.name;
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized access" });
    }
  };
};

module.exports = { authMiddleware };