const express = require('express');
const router = express.Router();
const { merge, union } = require('lodash');

const Tag = require('../models/tag');
const modelQuery = require('../util/model_query_util');

router.get('/search', function (req, res) {
  // res.send('this is search route.');
  let tagQuery = req.query.q;
  // response object should include: 
  // 1. blogs with names that match query string
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

router.get('/search/tags', function (req, res) {
  let tagQuery = req.query.q;
  modelQuery.findTags(tagQuery)
    .then((foundTags) => {
      res.json(foundTags);
    })
    .catch((err) => res.status(404).json([err.message]));
});

module.exports = router;