const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled post'
    },
    body: {
      type: String,
      required: false,
    },
    linkUrl: {
      type: String,
      required: false,
    },
    media: [{
      type: String
    }],
    likeCount: {
      type: Number,
      required: true,
      default: 0,
    },
    commentCount: {
      type: Number,
      required: true,
      default: 0,
    },
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
  }, { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('Post', postSchema);
