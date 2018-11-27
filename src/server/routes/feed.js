const express = require('express');
const router = express.Router();
const lodash = require('lodash');

const Post = require('../models/post');
const User = require('../models/user');
const Note = require('../models/note');
const middleware = require('../middleware/middleware');

// GET api/feed - Index posts for current user's feed
router.get('/feed', middleware.isLoggedIn, function (req, res) {
    User.findById(req.user._id)
        .exec(function (err, foundUser) {
            if (err || !foundUser) return res.status(404).json(['User not found.']);
            // query posts from current user's own blog and followed blogs
            Post.find()
                // FIX: figure out criteria of what to display on feed
                // .where('blog').in(lodash.concat(
                //     [foundUser.primaryBlog], // user's primary blog
                //     foundUser.following, // blogs that user follows
                //     foundUser.blogs)) // add'l blogs that user created
                .select('_id type title body media blog author likeCount commentCount createdAt')
                .sort({ 'createdAt': 'desc' })
                .populate({ path: 'blog', select: '_id avatarImageUrl backgroundImageUrl name title' })
                .lean(true)
                // .set({ likedByCurrentUser: true })
                .exec()
                .then((foundPosts) => {
                    let resultingPosts = [];
                    // check if current user likes the post
                    // foundPosts.forEach((post) => {
                    //     Note.findOne({ type: 'like', post: post._id, author: req.user._id })
                    //         .then((foundLike) => {
                    //             post.isLikedByCurrentUser = !!foundLike;
                    //             resultingPosts.push(post);
                    //             if (resultingPosts.length === foundPosts.length) {
                    //                 // debugger
                    //                 return res.json(resultingPosts);
                    //             }
                    //         });
                    // });
                    return res.json(foundPosts);
                })
                .catch((err) => res.json([err.message]));
        });
});

module.exports = router;