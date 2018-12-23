const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    unread: {
      type: Boolean,
      required: true,
      default: true,
    }
  },
  { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);