const express = require('express');
const router = express.Router({ mergeParams: true });
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

// DELETE api/blogs/:id/follows/:followId - DESTROY

module.exports = router;