const express = require('express');
const router = express.Router();
const { merge, union } = require('lodash');

const middleware = require('../middleware/middleware');
const modelQuery = require('../util/model_query_util');
const Tag = require('../models/tag');


// 1. TODO: blogs with names that match query string

router.get('/search/posts', middleware.isLoggedIn, function (req, res) {
  let tagQuery = req.query.q;
  // 2. posts with tags that match query string
  // 2a. find tags that match query string
  Tag.findOne({ label: tagQuery }) // if user clicks on a tag result, then find that one tag
    .then((foundTag) => {
      // debugger
      if (!foundTag) return modelQuery.findTags(tagQuery, 0); // if no exact match, then find tags that contain the query string
      return [foundTag];
    })
    .then((tags) => {
      if (!tags.length) return [];
      // 2b. find posts with tag array that includes the matching tag ids
      return modelQuery.findTagPosts(tags);
    })
    .then((tagsWithPosts) => {
      let searchPosts = tagsWithPosts.reduce((searchPosts, tag) => {
        return union(searchPosts, tag.posts);
      }, []);
      return res.json(searchPosts);
    })
    .catch((err) => res.status(404).json([err.message]));
});

router.get('/search/tags', middleware.isLoggedIn, function (req, res) {
  let tagQuery = req.query.q;
  modelQuery.findTags(tagQuery)
    .then((foundTags) => {
      res.json(foundTags);
    })
    .catch((err) => res.status(404).json([err.message]));
});

// GET api/users - search for users to chat with
router.get('/search/users', middleware.isLoggedIn, function (req, res) {
  let userQuery = req.query.q;
  modelQuery.findUsers(userQuery, req.user._id)
    .then((foundUsers) => {
      res.json(foundUsers);
    })
    .catch((err) => res.status(404).json([err.message]));
});

module.exports = router;