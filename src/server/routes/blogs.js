const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const lodash = require('lodash');

const modelQuery = require('../util/model_query_util');
const Blog = require('../models/blog');
const Post = require('../models/post');
const middleware = require('../middleware/middleware');


// SET UP FILE UPLOAD=====================
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp')
    },
    filename: function (req, file, cb) {
        // debugger
        cb(null, file.originalname);
    }
})
const upload = multer({ storage });
const AWS = require('aws-sdk');

console.log(process.env.AWS_USERNAME);

let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    Bucket: process.env.AWS_BUCKET,
});

// debugger
s3bucket.getBucketPolicy({ Bucket: process.env.AWS_BUCKET }, function (err, data) {
    if (err) return console.log(err);
    console.log(data);
})
// s3bucket.upload({ Bucket: 'auteur-dev/users', Body: 'test-again', Key: 'test3', ACL: 'public-read' }, function (err, data) {
//     if (err) console.log(err);
//     console.log(data);
// })
s3bucket.listObjects({ Bucket: 'auteur-dev' }, function (err, data) {
    if (err) return console.log(err);
    console.log(data.Contents);
})
// debugger
// SET UP FILE UPLOAD=====================

// GET api/blogs/:id - SHOW blog
router.get('/blogs/:id', middleware.isLoggedIn, function (req, res) {
    modelQuery.findOneBlog(
        req.params.id,
        (foundBlog) => res.json(foundBlog), // success callback
        (err) => res.status(404).json(['The blog does not exist.']), // failure callback
    );
});


// GET api/blogs/:id/posts - INDEX blog posts (should be moved to 'posts.js' routes)
router.get('/blogs/:id/posts', middleware.isLoggedIn, function (req, res) {
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
router.post(
    '/blogs/:id/posts',
    middleware.isLoggedIn,
    upload.array('media'), // file upload middleware
    function (req, res) {
        debugger
        // modelQuery.findOneBlog(
        //     req.params.id,
        //     (foundBlog) => {
        //         let newPost = lodash.merge({}, req.body);
        //         newPost.body = sanitizeHtml(newPost.body);
        //         Post.create(newPost)
        //             .then((createdPost) => {
        //                 foundBlog.postCount += 1;
        //                 foundBlog.save();
        //                 return res.json(createdPost);
        //             })
        //             .catch((err) => res.status(422).json([err.message]))
        //     },
        //     (err) => res.status(404).json(['The blog does not exist.']), // failure callback
        // );
    });

// DELETE api/blogs/:id/posts/:id
router.delete('/blogs/:id/posts/:postId', middleware.checkPostOwnership, function (req, res) {
    modelQuery.findOneBlog(
        req.params.id,
        (foundBlog) => {
            Post.findOneAndDelete(
                { _id: req.params.postId },
                function (err) {
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
router.put('/blogs/:id/posts/:postId', middleware.checkPostOwnership, function (req, res) {
    modelQuery.findOneBlog(
        req.params.id,
        (foundBlog) => {
            Post.findOneAndUpdate(
                { _id: req.params.postId },
                req.body,
                { new: true },
                function (err, updatedPost) {
                    if (err) return res.status(422).json([err.message]);
                    return res.json(updatedPost);
                });
        },
        (err) => res.status(404).json(['The blog does not exist.']), // failure callback
    );
});

module.exports = router;