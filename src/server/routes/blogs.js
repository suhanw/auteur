const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

// GET api/blog/:id - SHOW blog
router.get('/blogs/:id', function (req, res) {
    Blog.findOne({ _id: req.params.id })
        .populate({
            path: 'author',
            select: '_id username avatarImageUrl',
        })
        .exec(function (err, foundBlog) {
            if (err) {
                return res.json([err.message]);
            }
            return res.json(foundBlog);
        });
});

module.exports = router;