const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 2,
      maxlength: 15,
      match: /^[a-zA-Z\s]+$/, // Only letters and spaces
    },
    lastName: {
      type: String,
      lowercase: true,
      minlength: 2,
      maxlength: 15,
      match: /^[a-zA-Z\s]+$/, // Only letters and spaces
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validator(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
      // validator(value) {
      //   if (!validator.isStrongPassword(value, { minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
      //     throw new Error("Password is not strong enough");
      //   }
      // }
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender type"
      },
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },

    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
      // validate(value) {
      //   if (!validator.isURL(value)) {
      //     throw new Error("Invalid URL");
      //   }
      //   if (!/\.(jpg|jpeg|png|gif|bmp)$/i.test(value)) {
      //     throw new Error("Invalid image URL");
      //   }
      // }
    },
    about: {
      type: String,
      default: "this is a default description of me",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          // Maximum of 10 skills
          throw new Error("Too many skills");
        }
      },
    },
  },
  { timestamps: true }
);

//Compound index

userSchema.index({firstName:1, lastName:1})

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "Dev@Tinder@123", {
    expiresIn: "1d",
  });
  return token;
};

module.exports = new mongoose.model("User", userSchema);
