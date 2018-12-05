// const faker = require('faker');
const Blog = require('../../models/blog');
const User = require('../../models/user');
const Post = require('../../models/post');
const request = require('request');

const seedDB = function () {
  clearDB();
  // debugger

  users.forEach(function (user) {
    createUser(user.userObj)
      .then((createdUser) => {
        return createBlog(createdUser);
      })
      .then((createdBlog) => {
        // FIX: generate random posts here
        return fetchSeedPosts(user.movie, randomize(10), createdBlog);
      }).then(({ createdBlog, posts }) => {
        return createPosts(createdBlog, posts);
      })
      .then((createdPosts) => {
        // FIX: generate random notes here
        console.log(`${user.userObj.username} seeded!`);
      })
      .catch((err) => console.log(err));
  });
};



const clearDB = function () {
  User.deleteMany({}, (err) => { if (err) console.log(err) });
  Blog.deleteMany({}, (err) => { if (err) console.log(err) });
  Post.deleteMany({}, (err) => { if (err) console.log(err) });
};

const createUser = function (user) {
  return User.register(
    new User({
      username: user.username,
      email: user.email,
      avatarImageUrl: user.avatarImageUrl
    }),
    user.password
  );
};

const createBlog = function (author) {
  let newBlog = new Blog({
    author: author._id,
    primary: true,
    name: author.username,
    avatarImageUrl: author.avatarImageUrl,
    title: `${author.username}'s blog`,
    description: 'This is blog description.'
  });
  author.primaryBlog = newBlog._id;
  author.save();
  return newBlog.save();
};


const createPosts = function (blog, posts) {
  posts.forEach(function (post) {
    post.blog = blog._id;
    post.author = blog.author;
    let start = new Date(2016, 0, 1);
    let end = new Date();
    post.createdAt = randomizeDate(start, end);
    post.updatedAt = post.createdAt;
    blog.postCount += 1;
  });
  blog.save();
  return Post.insertMany(posts);
};

const randomize = (max) => {
  return Math.floor(Math.random() * max + 1);
}

const randomizeDate = function (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

let users = [
  {
    userObj: {
      email: 'rick@deckard.com',
      username: 'deckard',
      password: 'testing',
      avatarImageUrl: 'https://m.media-amazon.com/images/M/MV5BMTY4Mjg0NjIxOV5BMl5BanBnXkFtZTcwMTM2NTI3MQ@@._V1_UX214_CR0,0,214,317_AL_.jpg',
    },
    movie: 'blade_runner'
  },
  {
    userObj: {
      email: 'neo@theone.com',
      username: 'neo',
      password: 'testing',
      avatarImageUrl: 'https://m.media-amazon.com/images/M/MV5BNjUxNDcwMTg4Ml5BMl5BanBnXkFtZTcwMjU4NDYyOA@@._V1_SY1000_CR0,0,771,1000_AL_.jpg',
    },
    movie: 'matrix',
  },
  {
    userObj: {
      email: 'denzel@washington.com',
      username: 'denzel',
      password: 'testing',
      avatarImageUrl: 'https://www.alohacriticon.com/wp-content/uploads/2016/08/denzel-washington-foto-biografia.jpg'
    },
    movie: 'denzel+washington'
  },
  {
    userObj: {
      email: 'ripley@ripley.com',
      username: 'ripley',
      password: 'testing',
      avatarImageUrl: 'https://vignette.wikia.nocookie.net/avp/images/7/70/Ellen-Ripley.jpg/revision/latest?cb=20160528161612&path-prefix=fr'
    },
    movie: 'sigourney+weaver+xenomorph'
  },
  {
    userObj: {
      email: 'ian@malcolm.com',
      username: 'ian',
      password: 'testing',
      avatarImageUrl: 'https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/syfywire_blog_post/2018/09/jurassicParkJeffGoldblumShirtless.jpg?itok=Ktt3LJrf&timestamp=1536081511'
    },
    movie: 'jurassic_park'
  },
  {
    userObj: {
      email: 'ethan@hunt.com',
      username: 'ethan',
      password: 'testing',
      avatarImageUrl: 'https://vignette.wikia.nocookie.net/missionimpossible/images/5/5d/Ethan_Hunt_Fallout.jpg/revision/latest?cb=20180715010558'
    },
    movie: 'mission+impossible'
  },
  {
    userObj: {
      email: 'joseph@cooper.com',
      username: 'cooper',
      password: 'testing',
      avatarImageUrl: 'https://i.dailymail.co.uk/i/pix/2014/07/31/article-2711499-20242B7500000578-9_634x474.jpg'
    },
    movie: 'interstellar'
  },
];


const fetchSeedPosts = (movie, randomPos, createdBlog) => {
  return new Promise(function (resolve, reject) {
    request({
      url: `https://api.tenor.com/v1/search?key=6B1OGM0M79JU&q=${movie}&pos=${randomPos}&limit=50`,
      method: 'GET',
      timeout: 500,
    },
      function (err, response, responseJSON) {
        if (err) return reject(err);
        let posts = [];
        let items = JSON.parse(responseJSON).results;
        // debugger
        for (var i = 0; i < 10; i++) {
          let randomItem = items[randomize(50)];
          if (!randomItem) continue;
          posts.push({
            type: 'photo',
            media: [
              randomItem.media[0].gif.url,
            ]
          });
        }
        return resolve({ createdBlog, posts });
      });
  });
};

// fetchSeedPosts();
// seedDB();

module.exports = seedDB;
