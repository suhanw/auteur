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
  upload.array('newFiles'), // file upload middleware
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
  function (req, res) {
    modelQuery.findOneBlog(
      req.params.id,
      (foundBlog) => { // success cb for findOneBlog
        mediaUpload.deleteFiles(
          req.body.media,
          req.body,
          (deletedFiles) => { // success cb for deleteFiles
            Post.findOneAndDelete({ _id: req.params.postId })
              .exec()
              .then(function (deletedPost) {
                if (!deletedPost) {
                  return res.status(422).json(['Post does not exist.']);
                }
                foundBlog.postCount -= 1;
                foundBlog.save();
                return res.json(deletedPost.id);
              })
              .catch((err) => res.status(422).json([err.message]))
          },
          (err) => { // fail cb for deleteFiles
            res.status(422).json(err);
          },
        );
      },
      (err) => { // failure callback for findOneBlog
        res.status(422).json([err.message])
      },
    );
  });


// PUT api/blogs/:id/posts/:id (Update)
router.put('/posts/:postId',
  middleware.checkPostOwnership,
  upload.array('newFiles'),
  function (req, res) {
    // FIX: sync media files on AWS with app db
    modelQuery.findOneBlog(
      req.params.id,
      (foundBlog) => { // success cb for findOneBlog
        let postBody = lodash.merge({}, req.body);
        postBody.body = sanitizeHtml(postBody.body);
        mediaUpload.updateFiles(
          req.files,
          postBody,
          (updatedPostBody) => { // success cb for updateFiles
            Post.findOneAndUpdate(
              { _id: req.params.postId },
              updatedPostBody,
              { new: true },
              function (err, updatedPost) {
                if (err || !updatedPost) {
                  let errorMessage = err ? err.message : 'Post does not exist.';
                  return res.status(422).json([errorMessage]);
                }
                return res.json(updatedPost);
              });
          },
          (err) => res.status(422).json([err.message]) // failure cb for updateFiles
        );
      },
      (err) => res.status(422).json([err.message]), // failure cb for findOneBlog
    );
  });

module.exports = router;