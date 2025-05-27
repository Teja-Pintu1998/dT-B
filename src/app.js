const express = require("express");
const validator = require("validator");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const cors = require("cors");
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const { userRouter } = require("./routes/user");

app.use("/", authRouter);
app.use("/", userAuth, profileRouter); //If `userAuth` is not applied globally, there's a risk of forgetting to secure a route, leaving it exposed to unauthorized access. Applying it at the `app.use()` level ensures consistent security across all protected routes, reducing the chance of human error and vulnerabilities.
app.use("/", userAuth, requestRouter);
app.use("/", userRouter);

const port = 7777; //becoz  port should not change once it's set.

connectDB().then(() => {
  console.log("Database connection established...");
  app.listen(port, () => {
    console.log("Server is running on http://localhost:7777");
  });
});
