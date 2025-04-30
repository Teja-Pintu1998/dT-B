const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      //so, here the fromuserid of connectionrequests making the connection to the user collection whose _id is matching with the fromuserId right. if it matches it then we can have the access to the data of users collection whose _id is fromuserId.
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is not supported",
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//creating compound index for unique connection requests
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if the fromUserId and toUserId are the same
  if (
    connectionRequest.fromUserId.toString() ===
    connectionRequest.toUserId.toString()
  ) {
    throw new Error("Cannot send connection request to yourself");
  }

  // always call next() here because pre acts like middleware
  next();

  //When the logic is inside the Mongoose schema, it applies no matter where the save is triggered — from an API, a script, an admin panel, or another internal function.

  //If you ever reuse the same Mongoose model (e.g., in scheduled jobs, CLI tools, or other services), you don’t have to remember to repeat validations.

  //   API-level validation is user input protection.

  // Mongoose-level validation is data integrity enforcement.
});
const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
