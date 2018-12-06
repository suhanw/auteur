const express = require('express');
const router = express.Router();
const lodash = require('lodash');

const Post = require('../models/post');
const User = require('../models/user');
const Note = require('../models/note');
const middleware = require('../middleware/middleware');

// GET api/feed - Index posts for current user's feed
router.get('/feed', middleware.isLoggedIn, function (req, res) {
    return Post.find()
        // FIX: figure out criteria of what to display on feed
        // .where('blog').in(lodash.concat(
        //     [req.user.primaryBlog], // user's primary blog
        //     req.user.following, // blogs that user follows
        //     req.user.blogs)) // add'l blogs that user created
        .select('_id type title body media blog author linkUrl likeCount commentCount createdAt')
        .sort({ 'createdAt': 'desc' })
        .populate({ path: 'blog', select: '_id avatarImageUrl backgroundImageUrl name title' })
        .exec()
        .then((foundPosts) => {
            return res.json(foundPosts);
        })
        .catch((err) => res.status(400).json([err.message]));
});

module.exports = router;