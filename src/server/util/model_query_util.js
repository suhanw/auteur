let modelQuery = {};
const { merge, union } = require('lodash');
const Blog = require('../models/blog');
const Post = require('../models/post');
const Note = require('../models/note');
const Tag = require('../models/tag');

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

modelQuery.findOneBlog = function (blogId) {
  return Blog.findOne({ _id: blogId })
    .exec()
    .then(function (foundBlog) {
      if (!foundBlog) throw { message: 'The blog does not exist.' }; // case when ObjectId is valid, but doesn't belong to a blog
      return foundBlog;
    });
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
      return newLike.populate({
        path: 'post',
        select: 'likeCount',
      }).execPopulate();
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
      return deletedLike.populate({
        path: 'post',
        select: 'likeCount'
      }).execPopulate();
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
      return newComment.populate({
        path: 'post',
        select: 'commentCount',
      }).execPopulate();
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
      return deletedComment.populate({
        path: 'post',
        select: 'commentCount',
      }).execPopulate();
    })
    .then((deletedComment) => {
      deletedComment.post.commentCount -= 1;
      deletedComment.post.save();
      return deletedComment;
    });
}

modelQuery.findTags = function (tagQuery) {
  // debugger
  return Tag.$where(`this.label.includes('${tagQuery}')`)
    .select('label postCount')
    .limit(5)
    .lean(true)
    .exec()
    .then((foundTags) => {
      if (!foundTags.length) return []; // if no tags matched, return empty array
      return modelQuery.countTagPosts(foundTags);
    })
    .then((tags) => { // sort by most used tags
      tags.sort((a, b) => b.postCount - a.postCount) // short hand for desc sort based on a key value
      return tags;
    });
};

modelQuery.countTagPosts = function (tags) {
  return new Promise((resolve, reject) => {
    let tagsWithCount = tags.map(() => null);
    tags.forEach((tag, i) => {
      Post.countDocuments({ tags: tag._id })
        .exec()
        .then((count) => {
          tagsWithCount[i] = merge({ postCount: count }, tag);
          if (!tagsWithCount.includes(null)) resolve(tagsWithCount);
        })
        .catch((err) => reject(err));
    });
  });
};

modelQuery.findTagPosts = function (tags) {
  return new Promise((resolve, reject) => {
    let tagsWithPosts = tags.map(() => null); // to track that we found posts for each tag
    tags.forEach((tag, i) => {
      Post.find({ tags: tag._id })
        .sort({ 'createdAt': 'desc' }) // FIX: think about how to sort by most notes
        .populate({ path: 'blog', select: 'name avatarImageUrl backgroundImageUrl author' })
        .populate({ path: 'tags', select: 'label' })
        .exec()
        .then((foundPosts) => {
          tagsWithPosts[i] = merge({ posts: foundPosts }, tag);
          if (!tagsWithPosts.includes(null)) resolve(tagsWithPosts);
        })
        .catch((err) => reject(err));
    });
  });
};

modelQuery.addTagsToPost = function (post, blog) {
  return new Promise((resolve, reject) => {
    modelQuery.findOrCreateTags(post.tags)
      .then((tagObjIds) => {
        post.tags = tagObjIds;
        resolve({ post, blog });
      })
      .catch((err) => reject(err));
  });
}

modelQuery.findOrCreateTags = function (tags) {
  return new Promise((resolve, reject) => {
    if (!tags.length) return resolve([]);
    let tagObjIds = tags.map(() => null); // create a placeholder array with same num of elements
    tags.forEach((tagLabel, i) => {
      Tag.findOne({ label: tagLabel })
        .then((foundTag) => {
          if (!foundTag) return Tag.create({ label: tagLabel });
          return foundTag;
        })
        .then((tag) => {
          tagObjIds[i] = tag._id; // to preserve the order in which user entered tags
          if (!tagObjIds.includes(null)) return resolve(tagObjIds); // only resolve after all tags are either found or created
        })
        .catch((err) => reject(err));
    });
  });
};

module.exports = modelQuery;