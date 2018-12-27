const express = require('express');
const router = new express.Router({ mergeParams: true });

const middleware = require('../middleware/middleware');
const Notification = require('../models/notification');

router.get('/notifications', middleware.isLoggedIn, function (req, res) {
  const { countUnread } = req.query;
  if (countUnread === 'true') {
    return Notification.countDocuments({ unread: true })
      .exec()
      .then((unreadCount) => {
        res.json(unreadCount);
      });
  } else {
    return Notification.find({ notify: req.user._id })
      .select('type notify notifiable notifiableModel unread createdAt')
      .populate({ path: 'notifiable' })
      .exec()
      .then((foundNotifications) => {
        res.json(foundNotifications);
      });
  }
});

router.post('/notifications', middleware.isLoggedIn, function (req, res) {
  const newNotif = req.body;
  return Notification.create(newNotif)
    .then((createdNotif) => {
      // TODO: emit a socket for notif
      res.status(200).json(createdNotif);
    })
    .catch((err) => res.status(422).json(err.message));
});

// DELETE api/notifications - in case someone unlikes?

module.exports = router;