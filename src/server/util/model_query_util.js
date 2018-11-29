let modelQuery = {};
const Blog = require('../models/blog');
const Post = require('../models/post');
const Note = require('../models/note');

modelQuery.getCurrentUserLikes = function (userId) {
  return Note.find({ type: 'like', author: userId })
    .select('post')
    .exec()
    .then((likes) => {
      if (!likes) throw { message: 'Error.' }
      let likedPosts = likes.map((like) => like.post);
      return likedPosts;
    });
};

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

modelQuery.findOnePost = function (postId) {
  return Post.findOne({ _id: postId })
    .exec()
    .then(function (foundPost) {
      if (!foundPost) throw { message: 'The post does not exist.' };
      return foundPost;
    });
};

modelQuery.createLike = function (likeBody) {
  return Note.findOne({ type: 'like', post: likeBody.post, author: likeBody.author })
    .exec()
    .then((foundLike) => {
      if (foundLike) throw { message: 'You already liked this post. ' };
      // if user hasn't liked the post, create the like
      return Note.create(likeBody);
    })
    .then((newLike) => {
      return newLike.populate('post').execPopulate();
    })
    .then((newLike) => {
      newLike.post.likeCount += 1;
      newLike.post.save();
      return newLike;
    });
};

modelQuery.deleteLike = function (likeId) {
  return Note.findOneAndDelete({ _id: likeId })
    .exec()
    .then((deletedLike) => {
      if (!deletedLike) throw { message: 'You never liked this post to be able to unlike it. ' };
      return deletedLike.populate('post').execPopulate();
    })
    .then((deletedLike) => {
      deletedLike.post.likeCount -= 1;
      deletedLike.post.save();
      return deletedLike;
    });
}

modelQuery.createComment = function (commentBody) {
  return Note.create(commentBody)
    .then((newComment) => {
      return newComment.populate('post').execPopulate();
    })
    .then((newComment) => {
      newComment.post.commentCount += 1;
      newComment.post.save();
      return newComment;
    });
}

modelQuery.deleteComment = function (commentId) {
  return Note.findOneAndDelete({ _id: commentId })
    .exec()
    .then((deletedComment) => {
      if (!deletedComment) throw { message: 'This comment does not exist. ' };
      return deletedComment.populate('post').execPopulate();
    })
    .then((deletedComment) => {
      deletedComment.post.commentCount -= 1;
      deletedComment.post.save();
      return deletedComment;
    });
}


module.exports = modelQuery;