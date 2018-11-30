const express = require('express');
const router = express.Router({ mergeParams: true });
const sanitizeHtml = require('sanitize-html');
const lodash = require('lodash');

const Note = require('../models/note');
const modelQuery = require('../util/model_query_util');
const middleware = require('../middleware/middleware');

// GET api/posts/:id/notes - INDEX
router.get('/notes', function (req, res) {
  const postId = req.params.id;
  Note.find({ post: postId })
    .select('author post type body createdAt')
    .populate({ path: 'author', select: 'avatarImageUrl username' })
    .sort({ 'createdAt': 'asc' })
    .then((notes) => {
      let responseJSON = {
        postId: postId,
        notes: notes,
      };
      return res.json(responseJSON);
    })
    .catch((err) => res.status(400).json([err.message]));
});


// POST api/posts/:id/notes - Create
router.post('/notes', middleware.isLoggedIn, function (req, res) {
  modelQuery.findOnePost(req.params.id)
    .then((foundPost) => {
      let noteBody = lodash.merge({}, req.body);
      if (noteBody.body) noteBody.body = sanitizeHtml(noteBody.body);
      switch (noteBody.type) {
        case 'like':
          return modelQuery.createLike(noteBody);
        case 'comment':
          return modelQuery.createComment(noteBody);
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
  // FIX: add middleware to check for note ownership
  modelQuery.findOnePost(req.params.id)
    .then((foundPost) => {
      switch (req.body.type) {
        case 'like':
          return modelQuery.deleteLike(req.params.noteId);
        case 'comment':
          return modelQuery.deleteComment(req.params.noteId);
        default:
          return;
      }
    })
    .then((deletedNote) => {
      res.json(deletedNote);
    })
    .catch((err) => res.status(422).json([err.message]));
});

module.exports = router;