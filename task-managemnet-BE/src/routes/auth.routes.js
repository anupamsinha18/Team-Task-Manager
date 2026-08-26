const express=require("express");
const AuthRouter=express.Router();
const { signup, login } = require("../controllers/auth.controllers");

AuthRouter.post("/signup",signup);
AuthRouter.post("/login",login);

module.exports={AuthRouter}