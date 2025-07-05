const Message = require("../models/Message");
const User = require("../models/UserModel");
const {userMap, getIO}= require('../util/socketStore.js');
const cloudinary = require("../util/cloudinary");

const getUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    //number of unseen texts
    const unseenTexts = {};
    const promises = filteredUsers.map(async (user) => {
      const texts = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (texts.length > 0) {
        unseenTexts[user._id] = texts.length;
      }
    });
    await Promise.all(promises);
    res.json({ success: true, users: filteredUsers, unseenTexts });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, messaeg: error.message });
  }
};

//get all texts for selected user

const getTexts = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const texts = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, texts });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const markSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const io = getIO();

    //console.log("usermap: ", userMap);
    const receiverSocketId = userMap[receiverId];
    //console.log("receiverSocketId:", userMap[receiverId]);
    
    console.log("Received message via socket:", newMessage);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } else {
      console.log("❌ Receiver not online or not mapped");
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, getTexts, markSeen, sendMessage };
