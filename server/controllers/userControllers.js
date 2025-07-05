const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../util/jwt");
const cloudinary = require("../util/cloudinary");

const signup = async (req, res) => {
  
  const { fullName, email, password } = req.body;
  console.log({ fullName, email, password });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio:"Hey there! I'm using VI-Chat"
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      userData: newUser,
      token,
      message: "Signup successful",
      userId: newUser._id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email ", email)

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.status(200).json({ success: true, message: "Login successful", userData:user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: "Server error" });
  }
};

const checkAuth = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  res.json({ success: true, user: req.user });
};


//updating profile details;

const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    const userId = req.user._id;

    let updatedUser;
    if (!profilePic) {
      await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


module.exports={signup, login, updateProfile, checkAuth};