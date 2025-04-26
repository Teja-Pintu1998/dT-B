const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Virat",
    lastName: "kohli",
    email: "virat@kohli.com",
    password: "virat@123",
  };

  const user = new User(userObj);
  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong while saving user");
  }
});

connectDB().then(() => {
  console.log("Database connection established...");
  app.listen("7777", () => {
    console.log("Server is running on http://localhost:7777");
  });
});
