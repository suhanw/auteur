const express = require('express');
const router  = express.Router();
const passport = require('passport');
const User = require('../models/user');

// POST api/users
router.post('/users', function(req, res) {
  User.register(
    new User({ username: req.body.username, email: req.body.email }),
    req.body.password,
    function(err, createdUser) {
      if (err) {
        return res.status(422).json({ errors: err.message });
      }
      passport.authenticate('local')(req, res, function() {
        return res.json({message: 'Signup successful!'});
      });
    }
  );
})

module.exports = router;
