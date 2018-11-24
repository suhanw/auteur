const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: [true, 'Username has already been taken.'],
      required: true,
    },
    avatarImageUrl: {
      type: String,
      default: 'images/defaultUserAvatar.svg'
    },
    primaryBlog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
    blogs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    }]
  },
  { timestamps: { createdAt: 'createdAt' } }
);

userSchema.plugin(
  passportLocalMongoose,
  {
    usernameField: 'email',
    errorMessages: {
      MissingUsernameError: 'You do have to fill this out, you know. ',
      MissingPasswordError: 'You do have to fill this out, you know. ',
      UserExistsError: 'A user with the given email has already signed up. '
    }
  }
);

userSchema.plugin(
  uniqueValidator,
  { message: 'Another user has used the {PATH}.' }
);

module.exports = mongoose.model('User', userSchema);
