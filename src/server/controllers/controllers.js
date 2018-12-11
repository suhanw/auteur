const express = require('express');
const router = express.Router();

const userRoutes = require('../routes/users');
const sessionRoutes = require('../routes/session');
const feedRoutes = require('../routes/feed');
const blogRoutes = require('../routes/blogs');
const postRoutes = require('../routes/posts');
const followRoutes = require('../routes/follows');
const noteRoutes = require('../routes/notes');
const searchRoutes = require('../routes/search');
const linkPreviewRoute = require('../routes/link_preview');

const User = require('../models/user');

router.get(
    "/",
    function (req, res) {
        return res.render('index', { currentUser: req.user });
    });

router.use('/api', userRoutes);
router.use('/api', sessionRoutes);
router.use('/api', feedRoutes);
router.use('/api', blogRoutes);
router.use('/api', searchRoutes);
router.use('/api/blogs/:id', postRoutes);
router.use('/api/blogs/:id', followRoutes);
router.use('/api/posts/:id', noteRoutes);

router.use('/api', linkPreviewRoute);

module.exports = router;