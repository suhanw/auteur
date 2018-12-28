const express = require('express');
const router = new express.Router({ mergeParams: true });

const middleware = require('../middleware/middleware');
const modelQuery = require('../util/model_query_util');
const Notification = require('../models/notification');

// GET api/notifications
router.get('/notifications', middleware.isLoggedIn, function (req, res) {
  const { countUnread } = req.query;
  if (countUnread === 'true') { // to get unread notif count for navbar, or 
    return Notification.countDocuments({ unread: true })
      .where('notify').equals(req.user._id)
      .then((unreadCount) => {
        res.json(unreadCount);
      })
      .catch((err) => res.status(404).json([err.message]));
  } else { // to get all notifs for the notification popover
    // TODO: UPDATE UNREAD TO FALSE????
    return modelQuery.findNotifications(req.user)
      .then((notifications) => {
        res.json(notifications);
      })
      .catch((err) => res.status(404).json([err.message]));
  }
});

// POST api/notifications 
router.post('/notifications', middleware.isLoggedIn, function (req, res) {
  const newNotif = req.body;
  return Notification.create(newNotif)
    .then((createdNotif) => {
      // TODO: emit a socket for notif
      res.status(200).json(createdNotif);
    })
    .catch((err) => res.status(422).json(err.message));
});

module.exports = router;