const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const lodash = require('lodash');
const modelQuery = require('../util/model_query_util');
const Blog = require('../models/blog');
const Post = require('../models/post');

// GET api/blogs/:id - SHOW blog
router.get('/blogs/:id', function (req, res) {
    modelQuery.findOneBlog(
        req.params.id,
        (foundBlog) => res.json(foundBlog), // success callback
        (err) => res.status(404).json(['The blog does not exist.']), // failure callback
    );
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
            let newPost = lodash.merge({}, req.body);
            newPost.body = sanitizeHtml(newPost.body);
            Post.create(newPost, function (err, createdPost) {
                if (err) return res.status(422).json([err.message]);
                // remember to increment postCount in blog model
                foundBlog.postCount += 1;
                foundBlog.save();
                return res.json(createdPost);
            });
        });
});

// DELETE api/blogs/:id/posts/:id
router.delete('/blogs/:id/posts/:postId', function (req, res) {
    // FIX: need to add middleware to authenticate and authorize user!
    Blog.findOne({ _id: req.params.id })
        .exec(function (err, foundBlog) {
            if (err || !foundBlog) {
                return res.status(404).json(['The blog does not exist.']);
            }
            Post.deleteOne({ _id: req.params.postId }, function (err) {
                if (err) return res.status(422).json([err.message]);
                foundBlog.postCount -= 1;
                foundBlog.save();
                return res.json(req.params.postId);
            });
        });
});

// PUT api/blogs/:id/posts/:id
router.put('blogs/:id/posts/:postId', function (req, res) {
    Blog.findOne({ _id: req.params.id })
        .exec(function (err, foundBlog) {
            if (err || !foundBlog) {
                return res.status(404).json(['The blog does not exist.']);
            }

        })
});
// FIX: to finish post crud

module.exports = router;