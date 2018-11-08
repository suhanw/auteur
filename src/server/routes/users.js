const express = require('express');
const router  = express.Router();
const passport = require('passport');
const User = require('../models/user');

// POST api/users
router.post('/users',
  function(req, res) {
    User.register( // method provided by passport-local-mongoose
      new User({ username: req.body.username, email: req.body.email }),
      req.body.password,
      function(err, createdUser) {
        if (err) {
          return res.status(422).json([err.message]);
        }

        // invoking passport.authenticate() returns a middleware callback with the (req, res, next) signature.
        const middlewareCallback = passport.authenticate('local');

        // so we need to execute that cb to complete the response.
        middlewareCallback(req, res, function() {
          const {_id, email, username, avatarImageUrl, blogs, following} = createdUser;
          const userJSON = {_id, email, username, avatarImageUrl, blogs, following};
          return res.json(userJSON);
        });
      }
    );
  }
);

module.exports = router;
