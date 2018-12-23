const express = require('express');
const router = express.Router({ mergeParams: true });

const middleware = require('../middleware/middleware');
const modelQuery = require('../util/model_query_util');

// POST api/chats - to start a chat with another user
router.post('/chats', middleware.isLoggedIn, function (req, res) {
  const { chatPartner } = req.body;
  modelQuery.findOneUser(chatPartner)
    .then((chatPartner) => {
      let participants = [req.user._id, chatPartner._id];
      return modelQuery.createChatRoom(participants);
    })
    .then((chatRoom) => {
      res.json(chatRoom);
    })
    .catch((err) => res.status(422).json([err.message]));
});

module.exports = router;