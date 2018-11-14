const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const Post = require('../models/post');

// GET api/blogs/:id - SHOW blog
router.get('/blogs/:id', function (req, res) {
    Blog.findOne({ _id: req.params.id })
        .populate({
            path: 'author',
            select: '_id username avatarImageUrl',
        })
        .lean(true) // make the query return a POJO instead of Document
        .exec(function (err, foundBlog) {
            if (err || !foundBlog) {
                return res.status(404).json(['The blog does not exist.']);
            }
            // Post.find({ blog: foundBlog._id })
            //     .sort({ 'createdAt': 'desc' })
            //     .exec(function (err, posts) {
            //         if (err) return res.json([err.message]);
            //         foundBlog.posts = posts; // add posts array as key to blog JSON
            //         return res.json(foundBlog);
            //     });
            return res.json(foundBlog);
        });
});


// GET api/blogs/:id/posts - INDEX blog posts (should be moved to 'posts.js' routes)
router.get('/blogs/:id/posts', function (req, res) {
    Blog.findOne({ _id: req.params.id })
        .exec(function (err, foundBlog) {
            if (err || !foundBlog) {
                return res.status(404).json(['The blog does not exist.']);
            }
            Post.find({ blog: foundBlog._id })
                .sort({ 'createdAt': 'desc' })
                .select('type title media body likeCount commentCount blog createdAt')
                .exec(function (err, posts) {
                    if (err) return res.json([err.message]);
                    return res.json(posts);
                });
        });
});

module.exports = router;