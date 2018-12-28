const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const tagSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },
  }
);

tagSchema.plugin(
  uniqueValidator,
  { message: 'Tag already exists.' }
);

module.exports = mongoose.model('Tag', tagSchema);