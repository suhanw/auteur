const express = require('express');
const router = express.Router();

const userRoutes = require('../routes/users');
const sessionRoutes = require('../routes/session');
const blogRoutes = require('../routes/blogs');
const postRoutes = require('../routes/posts');
// const mediaUploadRoutes = require('../routes/media_uploads');

router.get("/", function (req, res) {
    res.render('index', { currentUser: req.user });
});

router.use('/api', sessionRoutes);
router.use('/api', userRoutes);
router.use('/api', blogRoutes);
router.use('/api', postRoutes);
// router.use('/api', mediaUploadRoutes);

module.exports = router;