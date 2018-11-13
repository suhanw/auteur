const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

// GET api/blog/:id
router.get('/blogs/:id', function (req, res) {
    Blog.findById(req.params.id)
        .populate('posts')
        .exec(function (err, foundBlog) {
            if (err) {
                return res.json([err.message]);
            }
            return res.json(foundBlog);
        });
});

module.exports = router;