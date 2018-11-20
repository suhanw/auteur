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
const storage = multer.memoryStorage();
const upload = multer({ storage });
const AWS = require('aws-sdk');

let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    Bucket: process.env.AWS_BUCKET,
});
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
        modelQuery.findOneBlog(
            req.params.id,
            (foundBlog) => {
                let newPost = lodash.merge({}, req.body);
                newPost.body = sanitizeHtml(newPost.body);
                Post.create(newPost)
                    .then((createdPost) => {
                        foundBlog.postCount += 1;
                        foundBlog.save();
                        const files = req.files;
                        let media = [];
                        if (files.length > 0) { // if there is media, upload to AWS
                            // FIX: add loader, and grey out Post button when uploading
                            let path = process.env.AWS_BUCKET + `/users/${createdPost.author}/blogs/${createdPost.blog}/posts/${createdPost._id}`;
                            files.forEach(function (file) {
                                let params = {
                                    Bucket: path,
                                    Key: file.originalname,
                                    Body: file.buffer,
                                    ACL: 'public-read'
                                };
                                s3bucket.upload(params, function (err, data) {
                                    if (err) return res.status(422).json(err);
                                    // else successful
                                    media.push(data.Location);
                                    if (media.length === files.length) { // when all media files have been uploaded
                                        createdPost.media = media; // add media URLs to be persisted
                                        createdPost.save();
                                        return res.json(createdPost); // send response only after all media files have been uploaded
                                    }
                                });
                            });
                        } else { // if no media files, send response immediately
                            return res.json(createdPost);
                        }

                    })
                    .catch((err) => res.status(422).json([err.message]))
            },
            (err) => res.status(422).json([err.message]), // failure callback
        );
    });

// DELETE api/blogs/:id/posts/:id
router.delete('/blogs/:id/posts/:postId', middleware.checkPostOwnership, function (req, res) {
    // FIX: delete media file from AWS
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
    // FIX: sync media files on AWS with app db
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