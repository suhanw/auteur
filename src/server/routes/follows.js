const express = require('express');
const router = express.Router({ mergeParams: true });
const lodash = require('lodash');
const modelQuery = require('../util/model_query_util');
const User = require('../models/user');

// GET api/blogs/:id/follows - INDEX
router.get('/follows', function (req, res) {
  modelQuery.findOneBlog(
    req.params.id,
    (foundBlog) => {
      User.find({ following: foundBlog._id })
        .select('username avatarImageUrl primaryBlog')
        .populate({ path: 'primaryBlog', select: 'title', model: 'Blog' })
        .exec()
        .then(function (foundUsers) {
          res.json(foundUsers);
        })
        .catch(function (err) {
          res.json(err);
        });
    },
    (err) => res.status(404).json(['The blog does not exist.'])
  )
});

// POST api/blogs/:id/follows - CREATE
// only currentUser can 'follow' a blog
router.post('/follows', function (req, res) {
  // debugger
  modelQuery.findOneBlog(
    req.params.id,
    (foundBlog) => {
      const currentUser = req.user;
      if (currentUser.following.indexOf(foundBlog._id) > -1) {
        return res.status(422).json(['You are following this blog. ']);
      }
      currentUser.following.push(foundBlog._id);
      currentUser.save();
      foundBlog.followerCount += 1;
      foundBlog.save();
      const { _id, following } = currentUser;
      return res.json({ _id, following });
    },
    (err) => res.status(422).json([err.message])
  );
});

// DELETE api/blogs/:id/follows/ - DESTROY
router.delete('/follows', function (req, res) {
  res.send('this is delete follow')
  // modelQuery.findOneBlog(
  //   req.params.id,
  //   (foundBlog) => {
  //     const idxToDel = currentUser.following.indexOf(foundBlog._id);
  //     if (idxToDel < 0) {
  //       return res.status(422).json(['You never followed this blog. ']);
  //     }
  //     const currentUser = lodash.merge({}, req.user);
  //     currentUser.following.splice(idxToDel, 1);
  //     currentUser.save();
  //     foundBlog.save();
  //     const { _id, following } = currentUser;
  //     return res.json({ _id, following });
  //   },
  //   (err) => res.status(422).json([err.message])
  // );
});

module.exports = router;