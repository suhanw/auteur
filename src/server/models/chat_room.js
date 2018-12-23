const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('ChatRoom', chatRoomSchema);