let modelQuery = {};
const { merge, union } = require('lodash');
const User = require('../models/user');
const Blog = require('../models/blog');
const Post = require('../models/post');
const Note = require('../models/note');
const Tag = require('../models/tag');
const ChatRoom = require('../models/chat_room');
const ChatMessage = require('../models/chat_message');
const Notification = require('../models/notification');

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

modelQuery.findOneUser = function (username) {
  return User.findOne({ username: username })
    .select('username')
    .exec()
    .then((foundUser) => {
      if (!foundUser) throw { message: 'The user does not exist.' };
      return foundUser;
    });
};

modelQuery.findUsers = function (userQuery, currentUserId) {
  return User.$where(`this.username.includes('${userQuery}')`)
    .where('_id').ne(currentUserId) // exclude current user who's doiing the search
    .select('username avatarImageUrl')
    .lean(true)
    .exec()
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
        select: 'likeCount author',
      }).execPopulate();
    })
    .then((newLike) => {
      newLike.post.likeCount += 1;
      newLike.post.save();
      return newLike;
    });
};

modelQuery.deleteLike = function (likeId) {
  return Note.findOne({ _id: likeId })
    .exec()
    .then((foundLike) => {
      return foundLike.remove();
    })
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
        select: 'commentCount author',
      }).execPopulate();
    })
    .then((newComment) => {
      newComment.post.commentCount += 1;
      newComment.post.save();
      return newComment;
    });
}

modelQuery.deleteComment = function (commentId) {
  return Note.findOne({ _id: commentId })
    .exec()
    .then((foundComment) => {
      return foundComment.remove();
    })
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

modelQuery.findTags = function (tagQuery, limit = 5) {
  return Tag.$where(`this.label.includes('${tagQuery}')`)
    .select('label postCount')
    .limit(limit)
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
    let tagsWithPosts = new Array(tags.length); // to track that we found posts for each tag
    tags.forEach((tag, i) => {
      Post.find({ tags: tag._id })
        .sort({ 'createdAt': 'desc' }) // TODO: think about how to sort by most notes
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
    let tagObjIds = new Array(tags.length); // create a placeholder array with same num of elements
    tags.forEach((tagLabel, i) => {
      Tag.findOne({ label: tagLabel })
        .then((foundTag) => {
          if (!foundTag) return Tag.create({ label: tagLabel });
          return foundTag;
        })
        .then((tag) => {
          tagObjIds[i] = tag._id; // to preserve the order in which user entered tags
          if (!tagObjIds.includes(undefined)) return resolve(tagObjIds); // only resolve after all tags are either found or created
        })
        .catch((err) => reject(err));
    });
  });
};

modelQuery.findRecentChatMessages = function (currentUserId) {
  return ChatRoom.find()
    .where('participants')
    .in(currentUserId)
    .select('_id')
    .then((chatRooms) => {
      return findLastChatRoomActivity(chatRooms);
    })
    .then((recentChatMessages) => {
      return recentChatMessages.sort((a, b) => { // sort by most recent
        if (a.createdAt < b.createdAt) return 1;
        if (a.createdAt > b.createdAt) return -1;
        return 0;
      });
    });
};

const findLastChatRoomActivity = function (chatRooms) {
  let chatRoomCount = chatRooms.length;
  let recentChatMessages = [];
  return new Promise((resolve, reject) => {
    chatRooms.forEach((chatRoom) => {
      modelQuery.findLastChatMessage(chatRoom._id)
        .then((lastChatMessage) => {
          if (!lastChatMessage) return null;
          return lastChatMessage.populate({ path: 'author', select: 'username avatarImageUrl' })
            .execPopulate();
        })
        .then((lastChatMessage) => {
          chatRoomCount--;
          if (lastChatMessage) recentChatMessages.push(lastChatMessage);
          if (!chatRoomCount) resolve(recentChatMessages);
        })
        .catch((err) => reject(err));
    });
  });
};

modelQuery.findOneChatRoom = function (participants) {
  return ChatRoom.findOne()
    .where('participants')
    .all(participants)
    .then((foundChatRoom) => {
      if (!foundChatRoom) throw { message: 'Chat room does not exist. ' };
      return foundChatRoom.populate({
        path: 'participants',
        select: 'username avatarImageUrl',
      })
        .execPopulate();
    })
    .then((chatRoom) => {
      return populateChatMessages(chatRoom);
    })
    .then((chatRoom) => {
      return chatRoom;
    });
};

modelQuery.createChatRoom = function (participants) {
  return ChatRoom.create({ participants })
    .then((chatRoom) => {
      // populate participants
      return chatRoom.populate({
        path: 'participants',
        select: 'username avatarImageUrl',
      })
        .execPopulate();
    })
    .then((chatRoom) => {
      // populate messages
      return populateChatMessages(chatRoom);
    })
    .then((chatRoom) => {
      return chatRoom;
    });
};

const populateChatMessages = function (chatRoom) {
  return new Promise((resolve, reject) => {
    ChatMessage.find({ chatRoom: chatRoom._id })
      .sort({ 'createdAt': 'desc' })
      .exec()
      .then((foundMessages) => {
        let chatRoomObj = chatRoom.toObject(); // Cannot add new properties to MongoDB Documents
        chatRoomObj.messages = foundMessages;
        resolve(chatRoomObj);
      })
      .catch((err) => reject(err));
  });
};

modelQuery.createChatMessage = function (chatMessage) {
  return findOneChatRoomById(chatMessage.chatRoom)
    .then((foundChatRoom) => {
      return ChatMessage.create(chatMessage);
    })
};

modelQuery.findLastChatMessage = function (chatRoomId) {
  return findOneChatRoomById(chatRoomId)
    .then((foundChatRoom) => {
      return ChatMessage.findOne({ chatRoom: foundChatRoom._id })
        .sort({ 'createdAt': 'desc' });
    });
};

const findOneChatRoomById = function (id) {
  return ChatRoom.findOne({ _id: id })
    .then((foundChatRoom) => {
      if (!foundChatRoom) throw { message: 'Chat room does not exist. ' };
      return foundChatRoom;
    });
}

modelQuery.findNotifications = function (user) {
  return Notification.find({ notify: user._id })
    .select('type notify notifiable notifiableModel unread createdAt')
    .populate({ path: 'notifiable' })
    .sort({ 'createdAt': 'desc' })
    .exec()
    .then((foundNotifications) => {
      if (!foundNotifications) throw { message: 'Error' }
      return populateNotifiables(foundNotifications);
    });
};

const populateNotifiables = function (notifications) {
  return new Promise((resolve, reject) => {
    if (!notifications.length) resolve([]);
    let popNotifs = notifications.map(() => null);
    notifications.forEach((notification, i) => {

      // depending on the notification type, notifiable might be different models (Note, User, etc)
      let paths;
      if (notification.notifiableModel === 'Note') {
        paths = [
          { path: 'notifiable.author', select: 'username avatarImageUrl' },
          { path: 'notifiable.post', select: 'type title media' },
        ];
      } else if (notification.notifiableModel === 'User') {
        paths = [
          { path: 'notifiable', select: 'username avatarImageUrl' },
        ];
      }

      Notification.populate(notification, paths)
        .then((popNotif) => {
          popNotifs[i] = popNotif;
          if (!popNotifs.includes(null)) resolve(popNotifs);
        })
        .catch((err) => reject(err));
    });
  });
};

modelQuery.markNotificationsAsRead = function (user) {
  return Notification.updateMany(
    { notify: user._id, unread: true },
    { unread: false },
  )
    .exec();
};

module.exports = modelQuery;