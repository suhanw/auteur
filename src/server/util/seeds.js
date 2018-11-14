const faker = require('faker');
const Blog = require('../models/blog');
const User = require('../models/user');
const Post = require('../models/post');

const seedDB = function () {
  clearDB();

  users.forEach(function (user) {
    createUser(user);
  });
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
    new User({ username: user.username, email: user.email, avatarImageUrl: user.avatarImageUrl }),
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
    name: author.username,
    avatarImageUrl: author.avatarImageUrl,
  });
  newBlog.save(function (err, createdBlog) {
    if (err) {
      return console.log(err);
    }
    author.primaryBlog = createdBlog._id;
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
          createdBlog.followerCount += 1;
          createdBlog.save();
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
    avatarImageUrl: faker.image.avatar(),
  },
  {
    email: 'vzhang@gmail.com',
    username: 'vzhang',
    password: 'testing',
    avatarImageUrl: faker.image.avatar(),
  },
  {
    email: 'noah@gmail.com',
    username: 'noah',
    password: 'testing',
    avatarImageUrl: faker.image.avatar(),
  }
]

let posts = [
  {
    type: 'text',
    body: faker.lorem.paragraphs(),
  },
  {
    type: 'photo',
    body: faker.lorem.paragraphs(),
    media: [
      '/images/Zhang-10.jpg',
      '/images/IMG-0250.JPG',
    ],
  },
  {
    type: 'text',
    body: faker.lorem.paragraphs(),
  }
];

module.exports = seedDB;
