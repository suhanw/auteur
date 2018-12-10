const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },
  }
);

module.exports = mongoose.model('Tag', tagSchema);