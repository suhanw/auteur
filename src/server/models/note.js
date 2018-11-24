const mongoose = require('mongoose');

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
