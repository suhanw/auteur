const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    notify: { // the user being notified
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notifiable: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'notifiableModel',
      required: true,
      unique: true,
    },
    notifiableModel: {
      type: String,
      required: true,
      enum: ['Note', 'User'],
    },
    unread: {
      type: Boolean,
      required: true,
    },
  }, { timestamps: { createdAt: 'createdAt' } }
);

notificationSchema.plugin(
  uniqueValidator,
  { message: 'Notification already exists.' }
);

module.exports = mongoose.model('Notification', notificationSchema);