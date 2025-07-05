const express = require('express');
const protectRoute = require('../middleware/auth');
const { getUsers, getTexts, markSeen, sendMessage } = require('../controllers/messageController');

const messageRouter = express.Router();

messageRouter.get('/user', protectRoute, getUsers);
messageRouter.get('/:id', protectRoute, getTexts);
messageRouter.get('/mark/:id', protectRoute, markSeen);
messageRouter.post('/send/:id', protectRoute, sendMessage);

module.exports=messageRouter;