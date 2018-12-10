const express = require('express');
const router = express.Router({ mergeParams: true });

const modelQuery = require('../util/model_query_util');
const middleware = require('../middleware/middleware');
const User = require('../models/user');

// GET api/blogs/:id/follows - INDEX followERS
router.get('/follows', middleware.isLoggedIn, function (req, res) {
  modelQuery.findOneBlog(req.params.id)
    .then((foundBlog) => {
      if (!foundBlog) throw { message: 'Blog does not exist.' };
      return User.find({ following: foundBlog._id })
        .select('username avatarImageUrl primaryBlog')
        .populate({ path: 'primaryBlog', select: 'name title avatarImageUrl backgroundImageUrl' })
        .exec()
    })
    .then((foundUsers) => {
      let blog = { _id: req.params.id }
      let responseJSON = {
        blog: blog,
        followers: foundUsers,
      }
      return res.json(responseJSON);
    })
    .catch((err) => res.status(404).json([err.message]));
});


// POST api/blogs/:id/follows - CREATE
router.post('/follows', middleware.isLoggedIn, function (req, res) {
  modelQuery.findOneBlog(req.params.id)
    .then((foundBlog) => {
      const currentUser = req.user; // only currentUser can 'follow' a blog
      if (currentUser.following.indexOf(foundBlog._id) > -1) {
        throw { message: 'You are already following this blog. ' };
      } else if (foundBlog.author.equals(currentUser._id)) {
        throw { message: 'You cannot follow your own blog. ' };
      }
      currentUser.following.push(foundBlog._id);
      currentUser.save();
      foundBlog.followerCount += 1;
      foundBlog.save();
      const { _id, following } = currentUser;
      return res.json({ _id, following });
    })
    .catch((err) => res.status(422).json([err.message]));
});


// DELETE api/blogs/:id/follows/ - DESTROY
router.delete('/follows', middleware.isLoggedIn, function (req, res) {
  modelQuery.findOneBlog(req.params.id)
    .then((foundBlog) => {
      const currentUser = req.user; // only currentUser can 'follow' a blog
      const idxToDel = currentUser.following.indexOf(foundBlog._id);
      if (idxToDel < 0) {
        throw { message: 'You never followed this blog. ' };
      }
      currentUser.following.splice(idxToDel, 1);
      currentUser.save();
      foundBlog.followerCount -= 1;
      foundBlog.save();
      const { _id, following } = currentUser;
      return res.json({ _id, following });
    })
    .catch((err) => res.status(422).json([err.message]));
});

module.exports = router;