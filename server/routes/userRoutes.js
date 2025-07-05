const express = require('express');
const { signup, login, updateProfile, checkAuth } = require('../controllers/userControllers');
const protectRoute = require('../middleware/auth');
const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.put('/update-profile', protectRoute, updateProfile);
userRouter.get('/check', protectRoute,checkAuth);

module.exports=userRouter;