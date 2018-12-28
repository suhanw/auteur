const mongoose = require('mongoose');

const Notification = require('./notification');

const noteSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: false,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  }, { timestamps: { createdAt: 'createdAt' } }
);

noteSchema.pre('remove', function (next) {
  return Notification.findOneAndDelete({ notifiable: this._id })
    .exec()
    .then((_) => {
      next();
    })
    .catch((err) => next(err)); // argument passed into next is assumed to be an error
});

module.exports = mongoose.model('Note', noteSchema);