const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    notifiable: {
      type: String,
      required: true,
    },
  }, { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('Notification', notificationSchema);