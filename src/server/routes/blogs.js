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
    modelQuery.findOneBlog(
        req.params.id,
        (foundBlog) => {
            Post.find({ blog: foundBlog._id })
                .sort({ 'createdAt': 'desc' })
                .select('type title media body likeCount commentCount blog createdAt')
                .exec()
                .then((posts) => res.json(posts))
                .catch((err) => res.json([err.message]));
        },
        (err) => res.status(404).json(['The blog does not exist.']), // failure callback
    );
});

// POST api/blogs/:id/posts
router.post('/blogs/:id/posts', function (req, res) {
    modelQuery.findOneBlog(
        req.params.id,
        (foundBlog) => {
            let newPost = lodash.merge({}, req.body);
            newPost.body = sanitizeHtml(newPost.body);
            Post.create(newPost)
                .then((createdPost) => {
                    foundBlog.postCount += 1;
                    foundBlog.save();
                    return res.json(createdPost);
                })
                .catch((err) => res.status(422).json([err.message]))
        },
        (err) => res.status(404).json(['The blog does not exist.']), // failure callback
    );
});

// DELETE api/blogs/:id/posts/:id
router.delete('/blogs/:id/posts/:postId', function (req, res) {
    // FIX: need to add middleware to authenticate and authorize user!
    modelQuery.findOneBlog(
        req.params.id,
        (foundBlog) => {
            Post.findOneAndDelete({ _id: req.params.postId }, function (err) {
                if (err) return res.status(422).json([err.message]);
                foundBlog.postCount -= 1;
                foundBlog.save();
                return res.json(req.params.postId);
            });
        },
        (err) => res.status(404).json(['The blog does not exist.']), // failure callback
    );
});

// PUT api/blogs/:id/posts/:id
router.put('blogs/:id/posts/:postId', function (req, res) {
    modelQuery.findOneBlog(
        req.params.id,
        (foundBlog) => {
            //    success
            console.log('updating ' + req.body);
        },
        (err) => res.status(404).json(['The blog does not exist.']), // failure callback
    );
});
// FIX: to finish post crud

module.exports = router;