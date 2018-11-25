const express = require('express');
const router = express.Router({ mergeParams: true });

const Note = require('../models/note');
const modelQuery = require('../util/model_query_util');
const middleware = require('../middleware/middleware');

// GET api/posts/:id/notes - INDEX
router.get('/notes', function (req, res) {
  res.send('this is notes index')
});


// POST api/posts/:id/notes - Create
router.post('/notes', middleware.isLoggedIn, function (req, res) {
  modelQuery.findOnePost(req.params.id)
    .then((foundPost) => {
      switch (req.body.type) {
        case 'like':
          return modelQuery.createLike(req.body)
        default:
          return;
      }
    })
    .then((newNote) => {
      res.json(newNote);
    })
    .catch((err) => res.status(422).json([err.message]));
});


// DELETE api/posts/:id/notes/:noteId - Destroy
router.delete('/notes/:noteId', middleware.isLoggedIn, function (req, res) {
  modelQuery.findOnePost(
    req.params.id,
    (foundPost) => { // success cb for findOnePost
      // current user can only delete own note
      res.send('this is delete note');
    },
    (err) => res.status(422).json([err.message]) // fail cb for findOnePost
  );
});

module.exports = router;