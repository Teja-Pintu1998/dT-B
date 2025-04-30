const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res
      .status(500)
      .send("Something went wrong while getting user profile - " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid edit request");
    }

    let loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();
    res.status(200).send({
      message: "User profile updated successfully",
      user: loggedInUser,
    });
  } catch (err) {
    res
      .status(500)
      .send(
        "Something went wrong while updating user profile - " + err.message
      );
  }
});

profileRouter.patch("/profile/update-password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .send("Both current and new passwords are required");
    }

    let loggedInUser = req.user;

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      loggedInUser.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).send("Current password is incorrect");
    }

    if (newPassword.length < 10) {
      return res
        .status(400)
        .send("New password must be at least 8 characters long");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = hashedPassword;

    await loggedInUser.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send(
        "Something went wrong while updating the password - " + err.message
      );
  }
});

module.exports = profileRouter;
