let modelQuery = {};
let Blog = require('../models/blog');

modelQuery.findOneBlog = function (blogId, handleSuccess, handleFailure) {
  // 'handleSuccess' callback func should be function(foundBlog) { ... }
  // 'handleFailure' callback func should be function(err) { ... }
  console.log('test');
  Blog.findOne({ _id: blogId })
    .populate({
      path: 'author',
      select: '_id',
    })
    .lean(true) // make the query return a POJO instead of Document
    .exec()
    .then(function (foundBlog) {
      if (!foundBlog) throw err; // case when ObjectId is valid, but doesn't belong to a blog
      handleSuccess(foundBlog);
    })
    .catch(handleFailure);
};

module.exports = modelQuery;