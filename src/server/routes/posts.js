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
const mediaUtil = require('../util/media_util');
const middleware = require('../middleware/middleware');

// GET api/blogs/:id/posts - INDEX blog posts (Read)
router.get('/posts', middleware.isLoggedIn, function (req, res) {
  modelQuery.findOneBlog(req.params.id)
    .then((foundBlog) => {
      return Post.find({ blog: foundBlog._id })
        .sort({ 'createdAt': 'desc' })
        .populate({ path: 'blog', select: '_id avatarImageUrl' })
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
    modelQuery.findOneBlog(req.params.id)
      .then((foundBlog) => {
        let postBody = lodash.merge({}, req.body);
        if (postBody.body) postBody.body = sanitizeHtml(postBody.body); // body is not required, so key may not exist
        postBody.tags = (postBody.tags.length) ? postBody.tags.split(',') : []; //FormData turns nested array into string
        return modelQuery.addTagsToPost(postBody, foundBlog);
      })
      .then(({ post, blog }) => {
        let newPost = new Post(post);
        // if a media post, upload files to AWS
        if (['photo', 'video', 'audio'].includes(newPost.type)) {
          // check file size before uploading
          let totalFileSize = req.files.reduce((totalFileSize, currFile) => { return totalFileSize + currFile.size }, 0); // in bytes
          if (totalFileSize > 2097152) throw { message: 'Total file size should not exceed 2 MB. Please try again.' };
          return mediaUtil.uploadFiles(req.files, req.body.urls, newPost, blog);
        }
        // if not a media post, pass on to the next 'then' block
        return { post: newPost, blog: blog };
      })
      .then(({ post, blog }) => { // destructure the single object argument
        blog.postCount += 1;
        blog.save();
        return post.save()
      })
      .then((post) => {
        return post.populate({ path: 'tags', select: 'label' })
          .execPopulate();
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
          return mediaUtil.deleteFiles(post, foundBlog);
        }
        // if not a media post, pass on to the next 'then' block
        return { post, blog: foundBlog };
      })
      .then(({ post, blog }) => {
        return Post.findOneAndDelete({ _id: post._id })
          .then((deletedPost) => {
            if (!deletedPost) throw { message: 'Post does not exist. ' };
            // TODO: replace this with middleware 'pre' hook
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
    modelQuery.findOneBlog(req.params.id)
      .then((foundBlog) => {
        let post = lodash.merge({}, req.body);
        if (post.body) post.body = sanitizeHtml(post.body); // body is not required, so key may not exist
        post.tags = (post.tags.length) ? post.tags.split(',') : []; //FormData doesn't support nested array, which is turned into string        
        return modelQuery.addTagsToPost(post, foundBlog);
      })
      .then(({ post }) => {
        // if a media post, upload files to AWS
        if (['photo', 'video', 'audio'].includes(post.type)) {
          // check file size before uploading
          let totalFileSize = req.files.reduce((totalFileSize, currFile) => { return totalFileSize + currFile.size }, 0); // in bytes
          if (totalFileSize > 2097152) throw { message: 'Total file size should not exceed 2 MB. Please try again.' };
          return mediaUtil.updateFiles(req.files, req.body.urls, post);
        }
        // if not a media post, pass on to the next 'then' block
        return post;
      })
      .then((post) => {
        return Post.findOneAndUpdate({ _id: post._id }, post, { new: true })
      })
      .then((updatedPost) => {
        if (!updatedPost) throw { message: 'Post does not exist. ' };
        return updatedPost.populate({ path: 'tags', select: 'label' })
          .execPopulate();
      })
      .then((updatedPost) => {
        return res.json(updatedPost);
      })
      .catch((err) => res.status(422).json([err.message]));
  });

module.exports = router;