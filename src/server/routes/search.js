const express = require('express');
const router = express.Router();
const { merge } = require('lodash');

const Tag = require('../models/tag');
const modelQuery = require('../util/model_query_util');

router.get('/search', function (req, res) {
  res.send('this is search route.');
  // response object should include: 
  // 1. blogs with names that match query string
  // 2. posts with tags that match query string
  // 2a. find tags that match query string
  // 2b. find posts with tag array that includes the matching tag ids
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