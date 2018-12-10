const express = require('express');
const router = express.Router();

router.get('/search', function (req, res) {
  res.send('this is search route.');
  // response object should include: 
  // 1. blogs with names that match query string
  // 2. posts with tags that match query string
  // 2a. find tags that match query string
  // 2b. find posts with tag array that includes the matching tag ids
});

module.exports = router;