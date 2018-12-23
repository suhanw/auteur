const express = require('express');
const router = express.Router({ mergeParams: true });
const { merge } = require('lodash');

const middleware = require('../middleware/middleware');
const modelQuery = require('../util/model_query_util');

// GET api/chats/:chatPartner - to get an existing chat
router.get('/chats/:chatPartner', middleware.isLoggedIn, function (req, res) {
  const { chatPartner } = req.params;
  modelQuery.findOneUser(chatPartner)
    .then((chatPartner) => {
      let participants = [req.user._id, chatPartner._id];
      return modelQuery.findOneChatRoom(participants);
    })
    .then((chatRoom) => {
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
  modelQuery.createChatMessage(chatMessage)
    .then((newChatMessage) => {
      let responseJSON = merge({}, newChatMessage);
      responseJSON.chatPartner = req.params.chatPartner;
      res.json(responseJSON);
    })
    .catch((err) => res.status(422).json([err.message]));
});

// GET api/chats/:id/messages - to pull the last message
// TODO: do we need this?
router.get('/chats/:chatPartner/messages', middleware.isLoggedIn, function (req, res) {
  modelQuery.findLastChatMessage(req.query.chatRoomId)
    .then((chatMessage) => {
      let responseJSON = merge({}, chatMessage);
      responseJSON.chatPartner = req.params.chatPartner;
      res.json(responseJSON);
    })
    .catch((err) => res.status(404).json([err.message]));
});

module.exports = router;