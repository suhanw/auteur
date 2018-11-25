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

modelQuery.createLike = function (noteBody, handleSuccess, handleFailure) {
  return Note.findOne({ type: 'like', post: noteBody.post, author: noteBody.author })
    .exec()
    .then((foundNote) => {
      // debugger
      if (foundNote) throw { message: 'You already liked this post. ' };
      // let newNote = new Note(noteBody);
      return Note.create(noteBody);
    })
    .then((newNote) => {
      // debugger
      return newNote.populate('post author').execPopulate();
    })
    .then(((newNote) => {
      // debugger
      newNote.post.likeCount += 1;
      newNote.post.save();
      newNote.author.likeCount += 1;
      newNote.author.save();
      // return handleSuccess(newNote.depopulate('post author'));
      return newNote.depopulate('post author');
    }))
  // .catch((err) => handleFailure(err));
}

module.exports = modelQuery;