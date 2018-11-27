const express = require('express');
const router = express.Router();
const passport = require('passport');
const lodash = require('lodash');

const middleware = require('../middleware/middleware');
const User = require('../models/user');
const Blog = require('../models/blog');
const Note = require('../models/note');

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
          createdUser.primaryBlog = createdBlog._id;
          createdUser.save();
          return;
        });

        // invoking passport.authenticate() returns a middleware callback with the (req, res, next) signature.
        const middlewareCallback = passport.authenticate('local');

        // so we need to execute that cb to complete the response.
        middlewareCallback(req, res, function () {
          const { _id, email, username, avatarImageUrl, primaryBlog, blogs, following, likeCount } = createdUser;
          const userJSON = { _id, email, username, avatarImageUrl, primaryBlog, blogs, following, likeCount };
          return res.json(userJSON);
        });
      }
    );
  }
);


// GET api/users/:id/likes - fetch user's liked posts
router.get('/users/:id/likes', middleware.isLoggedIn, function (req, res) {
  let likesQuery = Note.find({ type: 'like', author: req.params.id })
    .select('post');

  if (req.query.populate === 'true') {
    likesQuery = likesQuery.populate('post');
  }

  likesQuery.exec()
    .then((likes) => {
      if (!likes) throw { message: 'Error.' }
      let likedPosts = likes.map((like) => like.post);
      let userJSON = { // this will be merged with Redux 'users' state
        userId: req.params.id,
        likedPosts: likedPosts,
      };
      return res.json(userJSON);
    })
    .catch((err) => res.status(400).json([err.message]));
});

module.exports = router;