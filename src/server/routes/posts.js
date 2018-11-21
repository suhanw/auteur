const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });
const sanitizeHtml = require('sanitize-html');
const lodash = require('lodash');
const mediaUpload = require('../util/media_upload_util');

// SET UP AWS FILE UPLOAD=====================
const AWS = require('aws-sdk');

let s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  Bucket: process.env.AWS_BUCKET,
});
// SET UP AWS FILE UPLOAD=====================


const Blog = require('../models/blog');
const Post = require('../models/post');
const modelQuery = require('../util/model_query_util');
const middleware = require('../middleware/middleware');

// GET api/blogs/:id/posts - INDEX blog posts (Read)
router.get('/posts', middleware.isLoggedIn, function (req, res) {
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


// POST api/blogs/:id/posts (Create)
router.post('/posts',
  middleware.isLoggedIn,
  upload.array('media'), // file upload middleware
  function (req, res) {
    modelQuery.findOneBlog(
      req.params.id,
      (foundBlog) => { // success callback for findOneBlog
        let postBody = lodash.merge({}, req.body);
        postBody.body = sanitizeHtml(postBody.body);
        let newPost = new Post(postBody);
        mediaUpload.uploadFiles(
          req.files,
          newPost,
          (newPost) => { // success cb for uploadFiles
            newPost.save();
            foundBlog.postCount += 1;
            foundBlog.save();
            return res.json(newPost);
          },
          (err) => res.status(422).json(err), // failure cb for uploadFiles
        );
      },
      (err) => res.status(422).json([err.message]), // failure callback for findOneBlog
    );
  });


// DELETE api/blogs/:id/posts/:id (Destroy)
router.delete('/posts/:postId',
  middleware.checkPostOwnership,
  // FIX: delete media from AWS too
  upload.array('media'),
  function (req, res) {
    // FIX: delete media file from AWS
    modelQuery.findOneBlog(
      req.params.id,
      (foundBlog) => {
        mediaUpload.deleteFiles(
          req.body['media[]'], // bodyParser seems to append '[]' to a key that points to an array
          req.body,
          () => console.log('success'),
          () => console.log('fail'),
        );
        // Post.findOneAndDelete(
        //   { _id: req.params.postId },
        //   function (err) {
        //     if (err) return res.status(422).json([err.message]);
        //     foundBlog.postCount -= 1;
        //     foundBlog.save();
        //     return res.json(req.params.postId);
        //   });
        return res.json({ message: 'deleted' });
      },
      (err) => res.status(404).json(['The blog does not exist.']), // failure callback
    );
  });


// PUT api/blogs/:id/posts/:id (Update)
router.put('/posts/:postId',
  middleware.checkPostOwnership,
  upload.array('media'),
  function (req, res) {
    // FIX: sync media files on AWS with app db
    modelQuery.findOneBlog(
      req.params.id,
      (foundBlog) => {
        let postBody = lodash.merge({}, req.body);
        postBody.body = sanitizeHtml(postBody.body);
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