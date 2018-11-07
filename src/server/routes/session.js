const express = require('express');
const router = express.Router();
const passport = require('passport');

// POST api/session
router.post('/session',
  passport.authenticate('local'),
  function(req, res) {
    // res.send('api/login route')
    res.json(req.user);
  }
);

// DELETE api/session
router.delete('/session',
  function(req, res) {
    req.logout();
    res.json({message: 'Logout successful!'});
  }
);

module.exports = router;
