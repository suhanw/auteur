const express = require('express');
const router = express.Router();
const passport = require('passport');

// POST api/session
router.post('/session',
  function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) { next(err); }
      if (!user) { return res.status(401).json(['Your email or password were incorrect.']); }
      req.logIn(user, function (err) {
        if (err) { next(err); }
        return next();
      });
    })(req, res, next);
  },
  function (req, res) {
    const { _id, email, username, avatarImageUrl, primaryBlog, blogs, following } = req.user;
    const userJSON = { _id, email, username, avatarImageUrl, primaryBlog, blogs, following };
    res.json(userJSON);
  }
);

// DELETE api/session
router.delete('/session',
  function (req, res) {
    req.logout();
    res.json({ message: 'Logout successful!' });
  }
);

module.exports = router;
