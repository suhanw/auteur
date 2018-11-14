const express = require('express');
const router = express.Router();
const passport = require('passport');
const lodash = require('lodash');

const User = require('../models/user');
const Blog = require('../models/blog');

// POST api/users
router.post('/users',
  function (req, res) {
    User.register( // method provided by passport-local-mongoose
      new User({ username: req.body.username, email: req.body.email }),
      req.body.password,
      function (err, createdUser) {
        if (err) {
          return res.status(422).json([err.message]);
        }

        // create a primary blog when user has signed up
        Blog.create({
          author: createdUser._id,
          primary: true,
          avatarImageUrl: createdUser.avatarImageUrl,
          name: createdUser.username,
        }, function (err, createdBlog) {
          if (err) {
            return res.status(422).json([err.message]);
          }
          createdUser.blogs.push(createdBlog);
          createdUser.save();
          return;
        });

        // invoking passport.authenticate() returns a middleware callback with the (req, res, next) signature.
        const middlewareCallback = passport.authenticate('local');

        // so we need to execute that cb to complete the response.
        middlewareCallback(req, res, function () {
          const { _id, email, username, avatarImageUrl, blogs, following } = createdUser;
          const userJSON = { _id, email, username, avatarImageUrl, blogs, following };
          return res.json(userJSON);
        });
      }
    );
  }
);

module.exports = router;