const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    avatarImageUrl: {
      type: String,
      default: 'src/client/public/images/defaultUserAvatar.svg'
    },
    blogs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
      default: 1,
    }],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
      }
    ]
  },
  { timestamps: {createdAt: 'createdAt'} }
);

module.exports = mongoose.model('User', userSchema);
