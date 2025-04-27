const express = require("express");
const validator = require("validator");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());


const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not found - Please login again");
    }

    const decodedObj = await jwt.verify(token, "Dev@Tinder@123");
    const { _id } = decodedObj;
    
    const user = await User.findOne({ _id });
    if (!user) {
      throw new Error("Token not found - Please login again");
    }

    req.user = user;
    console.log(req.user);
    next();
  } catch (err) {
    res.status(401).send("Unauthorized access - " + err.message);
  }
};

module.exports = { userAuth };
