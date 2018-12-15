const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    primary: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: [true, 'Blog name has already been taken.'],
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled blog'
    },
    description: {
      type: String,
      required: false,
    },
    avatarImageUrl: {
      type: String,
      required: true,
      default: 'images/defaultUserAvatar.png',
    },
    backgroundImageUrl: {
      type: String,
      required: true,
      default: 'images/default_bg_01.png',
    },
    postCount: {
      type: Number,
      required: true,
      default: 0,
    },
    followerCount: {
      type: Number,
      required: true,
      default: 0,
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }]
  },
  { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('Blog', blogSchema);
