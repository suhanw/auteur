const faker = require('faker');
const Blog = require('../models/blog');
const User = require('../models/user');
const Post = require('../models/post');

const seedDB = function() {
  clearDB();

  User.create({
    email: 'suhanw@gmail.com',
    username: 'suhanw',
  }, function(err, createdUser) {
    if (err) {
      return console.log(err);
    }
    createBlog(createdUser);
  });
};

const clearDB = function() {
  User.deleteMany({}, function(err) {
    if (err) {
      return console.log(err);
    }
  });
  Blog.deleteMany({}, function(err) {
    if (err) {
      return console.log(err);
    }
  });
};


const createBlog = function(author) {
  let newBlog = new Blog({
    author: author._id,
    primary: true,
  });
  newBlog.save(function(err, createdBlog) {
    if (err) {
      return console.log(err);
    }
    author.blogs.push(createdBlog._id);
    author.save();
    createPosts(author, createdBlog, posts);
  });
};


const createPosts = function(author, blog, posts) {
  posts.forEach(function(post) {
    post.blog = blog._id;
    post.author = author._id;
    Post.create(post, function(err, createdPost) {
      if (err) {
        return console.log(err);
      }
      console.log('seeded!');
    })
  })
}

let posts = [
  {
    type: 'text',
    body: faker.lorem.paragraphs(),
  },
  {
    type: 'text',
    body: faker.lorem.paragraphs(),
  },
  {
    type: 'text',
    body: faker.lorem.paragraphs(),
  }
];

module.exports = seedDB;
