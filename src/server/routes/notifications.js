const express = require('express');
const router = new express.Router({ mergeParams: true });

const middleware = require('../middleware/middleware');
const modelQuery = require('../util/model_query_util');
const Notification = require('../models/notification');

function returnRouter(io) { // wrap router in a func, so that we can pass in io in app.js
  const notificationNsp = io.of('/notifications');

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
      // the only time this endpoint is hit is when user opens notif popover, therefore all notifs should be marked as read
      return modelQuery.markNotificationsAsRead(req.user)
        .then((updatedNotifs) => {
          if (updatedNotifs.n > 0) notificationNsp.emit(`notify ${req.user._id}`);
          return modelQuery.findNotifications(req.user)
        })
        .then((notifications) => {
          res.json(notifications);
        })
        .catch((err) => res.status(404).json([err.message]));
    }
  });

  // POST api/notifications 
  router.post('/notifications', middleware.isLoggedIn, function (req, res) {
    const newNotif = req.body;
    if (req.user._id.equals(newNotif.notify)) return res.status(200); // don't create notif when user comments on own post
    return Notification.create(newNotif)
      .then((createdNotif) => {
        notificationNsp.emit(`notify ${createdNotif.notify}`);
        res.status(200).json(createdNotif);
      })
      .catch((err) => res.status(422).json(err.message));
  });

  return router;
}

module.exports = returnRouter;