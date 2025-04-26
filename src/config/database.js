const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gjsteja2023:9EV0dgIR50ZWeKKQ@dt-db.veblyv1.mongodb.net/?retryWrites=true&w=majority&appName=dT-DB"
    );
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;
