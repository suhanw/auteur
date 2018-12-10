const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });
const sanitizeHtml = require('sanitize-html');
const lodash = require('lodash');

const Post = require('../models/post');
const Note = require('../models/note');
const Tag = require('../models/tag');
const modelQuery = require('../util/model_query_util');
const mediaUpload = require('../util/media_upload_util');
const middleware = require('../middleware/middleware');

// GET api/blogs/:id/posts - INDEX blog posts (Read)
router.get('/posts', middleware.isLoggedIn, function (req, res) {
  modelQuery.findOneBlog(req.params.id)
    .then((foundBlog) => {
      return Post.find({ blog: foundBlog._id })
        .sort({ 'createdAt': 'desc' })
        .populate({ path: 'blog', select: '_id' })
        .populate({ path: 'tags', select: 'label' })
        .exec()
    })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json(['Blog does not exist.']));
});


// POST api/blogs/:id/posts (Create)
router.post('/posts',
  middleware.isLoggedIn,
  upload.array('newFiles'), // file upload middleware - looks for the 'newFiles' key in body of http request
  function (req, res) {
    // FIX: add existing tags or crete new tags
    modelQuery.findOneBlog(req.params.id)
      .then((foundBlog) => {
        let postBody = lodash.merge({}, req.body);
        postBody.body = sanitizeHtml(postBody.body);
        postBody.tags = postBody.tags.split(','); //FormData doesn't support nested array, which is turned into string        

        // add existing tags or create new tags
        return new Promise((resolve, reject) => {
          modelQuery.addTags(postBody.tags)
            .then((tagObjIds) => {
              // debugger
              postBody.tags = tagObjIds;
              resolve({ postBody, foundBlog });
            })
            .catch((err) => reject(err));
        });
      })
      .then(({ postBody, foundBlog }) => {
        let newPost = new Post(postBody);
        // if a media post, upload files to AWS
        if (['photo', 'video', 'audio'].includes(newPost.type)) {
          let totalFileSize = req.files.reduce((totalFileSize, currFile) => { return totalFileSize + currFile.size }, 0); // in bytes
          if (totalFileSize > 2097152) throw { message: 'Total file size should not exceed 2 MB. Please try again.' };
          return mediaUpload.uploadFiles(req.files, req.body.urls, newPost, foundBlog);
        }
        // if not a media post, pass on to the next 'then' block
        // pass in single argument as resolution value
        return new Promise((resolve, reject) => resolve({ post: newPost, blog: foundBlog }));
      })
      .then(({ post, blog }) => { // destructure the single object argument
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
            Note.deleteMany({ post: deletedPost._id }, (err) => { if (err) throw err });
            blog.postCount -= 1;
            blog.save();
            return res.json(deletedPost);
          });
      })
      .catch((err) => res.status(422).json([err.message]));
  });


// PUT api/blogs/:id/posts/:id (Update)
router.put('/posts/:postId',
  middleware.checkPostOwnership,
  upload.array('newFiles'),
  function (req, res) {
    // FIX: add existing tags or crete new tags
    modelQuery.findOneBlog(req.params.id)
      .then((foundBlog) => {
        let post = lodash.merge({}, req.body);
        if (post.body) post.body = sanitizeHtml(post.body); // body is not required, so key may not exist
        if (['photo', 'video', 'audio'].includes(post.type)) {
          let totalFileSize = req.files.reduce((totalFileSize, currFile) => { return totalFileSize + currFile.size }, 0); // in bytes
          if (totalFileSize > 2097152) throw { message: 'Total file size should not exceed 2 MB. Please try again.' };
          return mediaUpload.updateFiles(req.files, req.body.urls, post);
        }
        // if not a media post, pass on to the next 'then' block
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