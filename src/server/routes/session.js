const express = require('express');
const router = express.Router();
const passport = require('passport');

// POST api/session
router.post('/session',
  passport.authenticate('local'),
  function(req, res) {
    res.json({message: 'Login successful!'});
  }
  // function(req, res, next) {
  //   passport.authenticate('local', function(err, user, info) {
  //     if (err) { return res.json(err); }
  //     if (!user) { return res.json(info); }
  //     req.logIn(user, function(err) {
  //       if (err) { return res.json(err); }
  //       return res.json(req.user);
  //     });
  //   });
  // }
);

// DELETE api/session
router.delete('/session',
  function(req, res, err) {
    if (err) {
      console.log(err);
    }
    req.logout();
    res.json({message: 'Logout successful!'});
  }
);

module.exports = router;
