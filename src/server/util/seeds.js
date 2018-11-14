const faker = require('faker');
const Blog = require('../models/blog');
const User = require('../models/user');
const Post = require('../models/post');

const seedDB = function () {
  clearDB();

  users.forEach(function (user) {
    createUser(user);
  });

  // make Suhan follow blogs
  // User.findOne({ email: 'suhanw@gmail.com' })
  //   .exec(function (err, foundUser) {
  //     if (err) return console.log(err);
  //     Blog.find({})
  //       .cursor()
  //       .on('data', function (blog) {
  //         foundUser.blogs.push(blog._id);
  //       })
  //       .on('end', function () {
  //         console.log('subscribed!');
  //       });
  //   });
};

const clearDB = function () {
  User.deleteMany({}, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  Blog.deleteMany({}, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  Post.deleteMany({}, function (err) {
    if (err) {
      return console.log(err);
    }
  })
};

const createUser = function (user) {
  User.register(
    new User({ username: user.username, email: user.email }),
    user.password,
    function (err, createdUser) {
      if (err) {
        return console.log(err);
      }
      console.log(createdUser._id + ' ' + createdUser.email + ' user created');

      createBlog(createdUser);
    }
  );
}


const createBlog = function (author) {
  let newBlog = new Blog({
    author: author._id,
    primary: true,
    title: author.username,
  });
  newBlog.save(function (err, createdBlog) {
    if (err) {
      return console.log(err);
    }
    author.blogs.push(createdBlog._id);
    author.save();
    // make Suhan follow blogs
    User.findOne({ email: 'suhanw@gmail.com' })
      .exec(function (err, foundUser) {
        if (err) return console.log(err);
        // debugger
        if (author.email !== foundUser.email) {
          console.log(author.email, foundUser.email);

          foundUser.following.push(createdBlog._id);
          foundUser.save();
          console.log('Suhan followed blog ' + createdBlog._id);
        }
      });
    createPosts(author, createdBlog, posts);
  });
};


const createPosts = function (author, blog, posts) {
  posts.forEach(function (post) {
    post.blog = blog._id;
    post.author = author._id;
  });
  Post.insertMany(posts, function (err, insertedPosts) {
    if (err) return console.log(err);
    insertedPosts.forEach(function (post) {
      console.log('seeded!');
    });
  })
}

let users = [
  {
    email: 'suhanw@gmail.com',
    username: 'suhanw',
    password: 'testing',
  },
  {
    email: 'vzhang@gmail.com',
    username: 'vzhang',
    password: 'testing',
  },
  {
    email: 'noah@gmail.com',
    username: 'noah',
    password: 'testing',
  }
]

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
