const express = require("express");
const authRouter = express.Router();
const {validateSignupData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignupData(req);
    const { firstName, lastName, emailId, password, skills } = req.body;
    //encrypting password
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      skills,
      password: passwordHash,
    });
    await user.save();
    console.log(user);
    res.status(201).send({ message: "User created successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message + " - Please try again");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      return res.status(400).send("Invalid username");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //create jwt token

      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      res.status(200).send({ message: "User logged in successfully", user });
    } else {
      return res.status(400).send("Invalid credentials");
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Something went wrong while logging user - " + err.message);
  }
});

module.exports = authRouter;
