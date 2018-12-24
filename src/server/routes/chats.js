const express = require('express');
const router = express.Router({ mergeParams: true });
const { merge } = require('lodash');

const middleware = require('../middleware/middleware');
const modelQuery = require('../util/model_query_util');

// GET api/chats - to get list of recent chats
router.get('/chats', middleware.isLoggedIn, function (req, res) {
  modelQuery.findRecentChatMessages(req.user._id)
    .then((recentChatMessages) => {
      res.json(recentChatMessages);
    })
    .catch((err) => res.status(404).json([err.message]));
});

// GET api/chats/:chatPartner - to get an existing chat
router.get('/chats/:chatPartner', middleware.isLoggedIn, function (req, res) {
  const { chatPartner } = req.params;
  modelQuery.findOneUser(chatPartner)
    .then((chatPartner) => {
      let participants = [req.user._id, chatPartner._id];
      return modelQuery.findOneChatRoom(participants);
    })
    .then((chatRoom) => {
      // TODO CHAT: any unread messages should be changed to read here
      let responseJSON = merge({}, chatRoom);
      responseJSON.chatPartner = chatPartner;
      res.json(responseJSON);
    })
    .catch((err) => res.status(404).json([err.message]));
});

// POST api/chats - to start a chat with another user
router.post('/chats', middleware.isLoggedIn, function (req, res) {
  const { chatPartner } = req.body;
  modelQuery.findOneUser(chatPartner)
    .then((chatPartner) => {
      let participants = [req.user._id, chatPartner._id];
      return modelQuery.createChatRoom(participants);
    })
    .then((chatRoom) => {
      let responseJSON = merge({}, chatRoom);
      responseJSON.chatPartner = chatPartner;
      res.json(responseJSON);
    })
    .catch((err) => res.status(422).json([err.message]));
});

// POST api/chats/:id/messages - to create new message
router.post('/chats/:chatPartner/messages', middleware.isLoggedIn, function (req, res) {
  const { chatMessage } = req.body;
  // TODO CHAT: if unread is true, emit a socket event to 'notify' the chat partner
  modelQuery.createChatMessage(chatMessage)
    .then((newChatMessage) => {
      newChatMessage = newChatMessage.toObject();
      let responseJSON = merge({}, newChatMessage);
      responseJSON.chatPartner = req.params.chatPartner;
      res.json(responseJSON);
    })
    .catch((err) => res.status(422).json([err.message]));
});

// GET api/chats/:id/messages - to pull the last message triggered by websocket event
router.get('/chats/:chatPartner/messages', middleware.isLoggedIn, function (req, res) {
  modelQuery.findLastChatMessage(req.query.chatRoomId)
    .then((chatMessage) => {
      chatMessage = chatMessage.toObject();
      let responseJSON = merge({}, chatMessage);
      responseJSON.chatPartner = req.params.chatPartner;
      res.json(responseJSON);
    })
    .catch((err) => res.status(404).json([err.message]));
});

module.exports = router;