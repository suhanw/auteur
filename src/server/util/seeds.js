const Blog = require('../models/blog');
const User = require('../models/user');

const seedDB = function() {
  User.deleteMany({}, function(err) {
    if (err) {
      console.log(err);
    }
  });
  Blog.deleteMany({}, function(err) {
    if (err) {
      console.log(err);
    }
  });

  User.create({
    email: 'suhanw@gmail.com',
    username: 'suhanw',
  }, function(err, createdUser) {
    let newBlog = new Blog({
      author: createdUser._id,
      primary: true,
    });
    newBlog.save(function(err, createdBlog) {
      if (err) {
        console.log(err);
      }
      createdUser.blogs.push(createdBlog._id);
      createdUser.save();
      console.log('seeded!');
    });
  });
};

module.exports = seedDB;
