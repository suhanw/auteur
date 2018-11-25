let modelQuery = {};
const Blog = require('../models/blog');
const Post = require('../models/post');
const Note = require('../models/note');

modelQuery.findOneBlog = function (blogId, handleSuccess, handleFailure) {
  // 'handleSuccess' callback func should be function(foundBlog) { ... }
  // 'handleFailure' callback func should be function(err) { ... }
  Blog.findOne({ _id: blogId })
    .populate({
      path: 'author',
      select: '_id',
    })
    // .lean(true) // make the query return a POJO instead of Document
    .exec()
    .then(function (foundBlog) {
      if (!foundBlog) throw { message: 'The blog does not exist.' }; // case when ObjectId is valid, but doesn't belong to a blog
      handleSuccess(foundBlog);
    })
    .catch(handleFailure);
};

modelQuery.findOnePost = function (postId, handleSuccess, handleFailure) {
  Post.findOne({ _id: postId })
    .exec()
    .then(function (foundPost) {
      if (!foundPost) throw { message: 'The post does not exist.' };
      handleSuccess(foundPost);
    })
    .catch(handleFailure);
};

modelQuery.createLike = function (likeBody, handleSuccess, handleFailure) {
  return Note.findOne({ type: 'like', post: likeBody.post, author: likeBody.author })
    .exec()
    .then((foundLike) => {
      if (foundLike) throw { message: 'You already liked this post. ' };
      return Note.create(likeBody);
    })
    .then((newLike) => {
      return newLike.populate('post author').execPopulate();
    })
    .then(((newLike) => {
      newLike.post.likeCount += 1;
      newLike.post.save();
      newLike.author.likeCount += 1;
      newLike.author.save();
      return newLike.depopulate('post author');
    }))
}

module.exports = modelQuery;