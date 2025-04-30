const express = require("express");
const app = express();
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
app.use(express.json());

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { status, toUserId } = req.params;

      //validate status

      const allowedStatuses = ["interested", "ignored"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      //validate toUserId

      const toUser = await User.findOne({ _id: toUserId });

      if (!toUser) {
        return res.json({
          message: "User not found",
        });
      }

      //below one is already written in the pre save middleware

      //   if (fromUserId.toString() === toUserId.toString()) {
      //     throw new Error("Cannot send connection request to yourself");
      //   }

      //check if connection request already exists

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exists");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      // Here, pre save middleware is called everytime before saving a new connection request into the database.
      const data = await connectionRequest.save();
      if (data.status === "ignored") {
        return res.json({
          message: "You ignored - " + toUser.firstName,
          data,
        });
      }
      res.json({
        message:
          "Successfully sent a connection request to - " + toUser.firstName,
        data,
      });
    } catch (err) {
      res
        .status(500)
        .send(
          "Something went wrong while sending connection request - " +
            err.message
        );
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;

      const loggedInUser = req.user;
     

      //validate status

      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      //here we need to check if the connection request exists
      //in the below we have to find that connectionrequest document which satisfies below fields and their values so we used the documentid itself -> _id
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.json({
          message: "Connection request not found",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: `$Connection request ${status} successfully`,
        data,
      });

      // this loggedin user can only accept or reject only if the status is interested if.e; only if the other person is interested then only loggenuser will get the notification saying someone is interested and leaves him a option whether to accept or reject
      //also check if the requesId is invalid or valid
    } catch (err) {
      res
        .status(500)
        .send(
          "Something went wrong while sending connection request - " +
            err.message
        );
    }
  }
);

module.exports = requestRouter;
