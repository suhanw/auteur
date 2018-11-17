const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const lodash = require('lodash');
const Blog = require('../models/blog');
const Post = require('../models/post');

// GET api/blogs/:id - SHOW blog
router.get('/blogs/:id', function (req, res) {
    Blog.findOne({ _id: req.params.id })
        .populate({
            path: 'author',
            select: '_id',
        })
        .lean(true) // make the query return a POJO instead of Document
        .exec(function (err, foundBlog) {
            if (err || !foundBlog) {
                return res.status(404).json(['The blog does not exist.']);
            }
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

// POST api/blogs/:id/posts
router.post('/blogs/:id/posts', function (req, res) {
    Blog.findOne({ _id: req.params.id })
        .exec(function (err, foundBlog) {
            if (err || !foundBlog) {
                return res.status(404).json(['The blog does not exist.']);
            }
            // remember to increment postCount in blog model
            foundBlog.postCount += 1;
            foundBlog.save();
            let newPost = lodash.merge({}, req.body);
            newPost.body = sanitizeHtml(newPost.body);
            Post.create(newPost, function (err, createdPost) {
                if (err) return res.status(422).json([err.message]);
                return res.json(createdPost);
            });
        });
});

module.exports = router;