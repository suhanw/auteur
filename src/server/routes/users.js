const express = require('express');
const router = express.Router();
const passport = require('passport');
const lodash = require('lodash');

const middleware = require('../middleware/middleware');
const User = require('../models/user');
const Blog = require('../models/blog');
const Post = require('../models/post');
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
          title: `${createdUser.username}'s blog`
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

// GET api/users/:id/following - fetch posts from blogs that current user follows
router.get('/users/:id/following', middleware.isLoggedIn, function (req, res) {
  User.findOne({ _id: req.user._id })
    .select('following')
    .then((foundUser) => {
      const followedBlogs = foundUser.following;
      return Post.find()
        .where('blog').in(followedBlogs)
        .sort({ 'createdAt': 'desc' })
        .populate({ path: 'blog', select: '_id avatarImageUrl backgroundImageUrl name title' })
        .populate({ path: 'tags', select: 'label' })
        .exec()
    })
    .then((foundPosts) => {
      return res.json(foundPosts);
    })
    .catch((err) => res.status(404).json([err.message]));
});


// GET api/users/:id/likes - fetch current user's liked posts
router.get('/users/:id/likes', middleware.isLoggedIn, function (req, res) {
  Note.find({ type: 'like', author: req.user._id })
    .sort({ '_id': 'desc' }) // latest likes first
    .select('post')
    .populate('post')
    .then((likes) => {
      if (!likes) throw { message: 'Error.' }
      return Note.populate( // Model.populate() returns a promise
        likes,
        [
          { path: 'post.blog', select: '_id avatarImageUrl backgroundImageUrl name title' },
          { path: 'post.tags', select: 'label' }
        ],
      );

    })
    .then((likes) => {
      let likedPosts = {};
      let posts = [];
      likes.forEach((like) => {
        likedPosts[like.post._id] = like._id;
        posts.push(like.post);
      });
      let responseJSON = { // this will be added to Redux 'users' state
        userId: req.params.id,
        likedPosts: likedPosts,
        likeCount: likes.length,
      };
      if (req.query.populate === 'true') {
        responseJSON['posts'] = posts;
      }
      return res.json(responseJSON);
    })
    .catch((err) => res.status(404).json([err.message]));
});


module.exports = router;