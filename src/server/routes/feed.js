const express = require('express');
const router = express.Router();
const lodash = require('lodash');

const Post = require('../models/post');
const User = require('../models/user');
const middleware = require('../middleware/middleware');

// GET api/feed - Index posts for current user's feed
router.get('/feed', middleware.isLoggedIn, function (req, res) {
    User.findById(req.user._id)
        .exec(function (err, foundUser) {
            if (err || !foundUser) return res.status(404).json(['User not found.']);

            // query posts from current user's own blog and followed blogs
            let posts = {};
            Post.find()
                // .where('blog').in(lodash.concat(
                //     [foundUser.primaryBlog], // user's primary blog
                //     foundUser.following, // blogs that user follows
                //     foundUser.blogs)) // add'l blogs that user created
                .select('_id type title body media blog author createdAt')
                .sort({ 'createdAt': 'desc' })
                .populate({ path: 'blog', select: '_id avatarImageUrl name title' })
                .exec(function (err, foundPosts) {
                    if (err) return res.json([err.message]);
                    return res.json(foundPosts);
                });
        });
});

module.exports = router;