const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });
const sanitizeHtml = require('sanitize-html');
const lodash = require('lodash');

const Blog = require('../models/blog');
const Post = require('../models/post');
const modelQuery = require('../util/model_query_util');
const mediaUpload = require('../util/media_upload_util');
const middleware = require('../middleware/middleware');

// GET api/blogs/:id/posts - INDEX blog posts (Read)
router.get('/posts', middleware.isLoggedIn, function (req, res) {
  modelQuery.findOneBlog(req.params.id)
    .then((foundBlog) => {
      return Post.find({ blog: foundBlog._id })
        .sort({ 'createdAt': 'desc' })
        .select('type title media body likeCount commentCount blog createdAt')
        .exec()
    })
    .then((posts) => res.json(posts))
    .catch((err) => res.json([err.message]));
});


// POST api/blogs/:id/posts (Create)
router.post('/posts',
  middleware.isLoggedIn,
  upload.array('newFiles'), // file upload middleware - looks for the 'newFiles' key in request data
  function (req, res) {
    modelQuery.findOneBlog(req.params.id)
      .then((foundBlog) => {
        let postBody = lodash.merge({}, req.body);
        postBody.body = sanitizeHtml(postBody.body);
        let newPost = new Post(postBody);
        // if a media post, upload files to AWS
        if (['photo', 'video', 'audio'].includes(newPost.type)) {
          return mediaUpload.uploadFiles(req.files, req.body.urls, newPost, foundBlog);
        }
        // if not a media post, pass on to the next 'then' block
        // pass in single argument as resolution value
        return new Promise((resolve, reject) => resolve({ post: newPost, blog: foundBlog }));
      })
      .then(({ post, blog }) => {
        // destructure the single object argument
        blog.postCount += 1;
        blog.save();
        return post.save();
      })
      .then((post) => {
        return res.json(post);
      })
      .catch((err) => res.status(422).json([err.message]));
  });


// DELETE api/blogs/:id/posts/:id (Destroy)
router.delete('/posts/:postId',
  middleware.checkPostOwnership,
  function (req, res) {
    modelQuery.findOneBlog(req.params.id)
      .then((foundBlog) => {
        const post = req.body;
        if (['photo', 'video', 'audio'].includes(post.type)) {
          return mediaUpload.deleteFiles(post, foundBlog);
        }
        // if not a media post, pass on to the next 'then' block
        // pass in single argument as resolution value
        return new Promise((resolve, reject) => resolve({ post, blog: foundBlog }));
      })
      .then(({ post, blog }) => {
        return Post.findOneAndDelete({ _id: post._id })
          .then((deletedPost) => {
            if (!deletedPost) throw { message: 'Post does not exist. ' };
            blog.postCount -= 1;
            blog.save();
            return res.json(deletedPost._id);
          });
      })
      .catch((err) => res.status(422).json([err.message]));
  });


// PUT api/blogs/:id/posts/:id (Update)
router.put('/posts/:postId',
  middleware.checkPostOwnership,
  upload.array('newFiles'),
  function (req, res) {
    modelQuery.findOneBlog(req.params.id)
      .then((foundBlog) => {
        let post = lodash.merge({}, req.body);
        post.body = sanitizeHtml(post.body);
        if (['photo', 'video', 'audio'].includes(post.type)) {
          return mediaUpload.updateFiles(req.files, req.body.urls, post);
        }
        // if not a media post, pass on to the next 'then' block
        // pass in single argument as resolution value
        return new Promise((resolve, reject) => resolve(post));
      })
      .then((post) => {
        return Post.findOneAndUpdate({ _id: post._id }, post, { new: true })
          .exec();
      })
      .then((updatedPost) => {
        if (!updatedPost) throw { message: 'Post does not exist. ' };
        return res.json(updatedPost);
      })
      .catch((err) => res.status(422).json([err.message]));
  });

module.exports = router;