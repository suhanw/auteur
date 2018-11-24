const express = require('express');
const router = express.Router({ mergeParams: true });

const modelQuery = require('../util/model_query_util');

// GET api/posts/:id/notes - INDEX
router.get('/notes', function (req, res) {
  res.send('this is notes index')
});

// POST api/posts/:id/notes - Create
router.post('/notes', function (req, res) {
  modelQuery.findOnePost(
    req.params.id,
    (foundPost) => { // success cb for findOnePost
      res.send('this is create note');
    },
    (err) => res.status(422).json([err.message]) // fail cb for findOnePost
  );
});

// DELETE api/posts/:id/notes - Destroy
router.delete('/notes', function (req, res) {
  modelQuery.findOnePost(
    req.params.id,
    (foundPost) => { // success cb for findOnePost
      res.send('this is delete note');
    },
    (err) => res.status(422).json([err.message]) // fail cb for findOnePost
  );
});

module.exports = router;