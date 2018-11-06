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
    title: {
      type: String,
      required: true,
      default: 'Untitled'
    },
    description: {
      type: String,
      required: false,
    },
    avatarImageUrl: {
      type: String,
      required: true,
      default: 'src/client/public/images/defaultBlogAvatar.svg',
    },
    backgroundImageUrl: {
      type: String,
      required: true,
      default: 'src/client/public/images/brick_bkgd-lime.png',
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
  { timestamps: {createdAt: 'createdAt'} }
);

module.exports = mongoose.model('Blog', blogSchema);
