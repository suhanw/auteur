const express = require('express');
const router = express.Router();
const lodash = require('lodash');

const Post = require('../models/post');
const middleware = require('../middleware/middleware');

// GET api/feed - Index posts for current user's feed
// FIX: figure out criteria of what to display on feed
// .where('blog').in(lodash.concat(
//     [req.user.primaryBlog], // user's primary blog
//     req.user.following, // blogs that user follows
//     req.user.blogs)) // add'l blogs that user created
router.get('/feed', middleware.isLoggedIn, function (req, res) {
    let limit = Number(req.query.limit);

    let feedQuery = Post.find()
        .select('_id type title body media blog author linkUrl likeCount commentCount createdAt')
        .sort({ 'createdAt': 'desc' })
        .populate({ path: 'blog', select: '_id avatarImageUrl backgroundImageUrl name title' })
        .limit(limit);

    if (req.query.lastPostDate !== 'null') { // this will be null in the initial fetch
        feedQuery = feedQuery
            .where('createdAt').lte(req.query.lastPostDate) // dates less than or on the last post's date
            .where('_id').ne(req.query.lastPostId) // so that the last rendered post is not re-fetched
    }

    feedQuery.exec()
        .then((foundPosts) => {
            return res.json(foundPosts);
        })
        .catch((err) => res.status(400).json([err.message]));
});

module.exports = router;