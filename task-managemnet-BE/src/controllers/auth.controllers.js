const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const salt = 10;
require("dotenv").config();

const signup = async (req, res) => {
  try {
    const { name, email, password, isActive} = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please Fill All The Fields." });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          return res
            .status(500)
            .json({ message: "Something Went Wrong, Please Try Again Later1." });
        } else {
          await UserModel.create({ ...req.body,name, email, password: hash, isActive });
          return res
            .status(201)
            .json({ message: "Signup Successfull, Please Login" });
        }
      });
    } else {
      res
        .status(400)
        .json({ message: "Account already exists, please login." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something Went Wrong, Please Try Again Later." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No User Found, Please Signup." });
    }
    let hash = user.password;
    bcrypt.compare(password, hash).then(function (result) {
      if (result === true) {
        let accessToken = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET_KEY,
          { expiresIn: 60 * 15 }
        );
        let refreshToken = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET_KEY,
          { expiresIn: 60 * 60 * 24 }
        );
        return res
          .status(200)
          .json({ message: "Login Successful", accessToken, refreshToken, user: { _id: user._id, name: user.name, email: user.email }});
      } else {
        return res
          .status(401)
          .json({ message: "The Password You Entered Is Wrong." });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something Went Wrong, Please Try Again Later." });
  }
};

module.exports = { signup, login };