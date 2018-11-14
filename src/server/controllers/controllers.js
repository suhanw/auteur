const express = require('express');
const router = express.Router();

const userRoutes = require('../routes/users');
const sessionRoutes = require('../routes/session');
const blogRoutes = require('../routes/blogs');
const postRoutes = require('../routes/posts');

router.get("/", function (req, res) {
    res.render('index', { currentUser: req.user });
});

router.use('/api', sessionRoutes);
router.use('/api', userRoutes);
router.use('/api', blogRoutes);
router.use('/api', postRoutes);

module.exports = router;