import { mergeWith, merge, union } from 'lodash';
import { normalize, schema } from 'normalizr';
import { RECEIVE_CURRENT_USER, REMOVE_CURRENT_USER } from '../../actions/session_actions';
import { FOLLOW_BLOG, UNFOLLOW_BLOG, RECEIVE_FOLLOWERS } from '../../actions/follow_actions';
import { RECEIVE_USERS, RECEIVE_USER_LIKES, RECEIVE_USER_FOLLOWING } from '../../actions/user_actions';
import { RECEIVE_NOTES } from '../../actions/note_actions';
import { RECEIVE_BLOGS } from '../../actions/blog_actions';
import { RECEIVE_CHAT_ROOM } from '../../actions/chat_actions';
import { replaceArray } from '../../util/misc_util';

const defaultState = {
  byId: {},
  allIds: [],
};

const blogSchema = new schema.Entity(
  'blogs',
  { author: new schema.Entity('users', {}, { idAttribute: '_id' }) },
  { idAttribute: '_id' }
);

const userSchema = new schema.Entity(
  'users',
  { primaryBlog: blogSchema },
  { idAttribute: '_id' }
);

const postSchema = new schema.Entity('posts',
  {},
  { idAttribute: '_id' });

const noteSchema = new schema.Entity('notes',
  {
    post: postSchema,
    author: userSchema,
  },
  { idAttribute: '_id' });

const chatRoomSchema = new schema.Entity('chatRooms',
  {
    participants: [userSchema],
    // messages: [messageSchema] TODO: add this later
  },
  { idAttribute: '_id' });

let payloadSchema;
let normalizedPayload;

const usersReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  let newCurrentUser = {};
  let userIdsArr = [];
  switch (action.type) {
    case RECEIVE_CHAT_ROOM:
      normalizedPayload = normalize(action.payload, chatRoomSchema);
      newState.byId = merge(
        {},
        state.byId,
        normalizedPayload.entities.users,
      );
      userIdsArr = Object.keys(normalizedPayload.entities.users)
      newState.allIds = union(state.allIds, userIdsArr);
      return newState;
    case RECEIVE_BLOGS:
      if (action.payload.length === 0) return state; // when user has not followed any blogs
      payloadSchema = [blogSchema];
      normalizedPayload = normalize(action.payload, payloadSchema);
      newState.byId = mergeWith(
        {},
        state.byId,
        normalizedPayload.entities.users,
        replaceArray,
      );
      userIdsArr = Object.keys(normalizedPayload.entities.users)
      newState.allIds = union(state.allIds, userIdsArr);
      return newState;
    case RECEIVE_NOTES:
      if (action.payload.notes.length === 0) return state; //when the post has no notes
      payloadSchema = [noteSchema];
      normalizedPayload = normalize(action.payload.notes, payloadSchema);
      newState.byId = merge(
        {},
        state.byId,
        normalizedPayload.entities.users
      );
      userIdsArr = Object.keys(normalizedPayload.entities.users)
      newState.allIds = union(state.allIds, userIdsArr);
      return newState;
    case FOLLOW_BLOG:
      newCurrentUser = { [action.payload._id]: action.payload };
      newState = {
        byId: mergeWith({}, state.byId, newCurrentUser, replaceArray),
        allIds: union(state.allIds, [action.payload._id]),
      };
      return newState;
    case UNFOLLOW_BLOG:
      newCurrentUser = { [action.payload._id]: action.payload };
      newState = {
        // need to use mergeWith(... replaceArray) because the new 'following' array 
        // has one less element than the old, so cannot use simple merge. 
        byId: mergeWith({}, state.byId, newCurrentUser, replaceArray),
        allIds: union(state.allIds, [action.payload._id]),
      };
      return newState;
    case RECEIVE_FOLLOWERS:
      payloadSchema = [userSchema];
      normalizedPayload = normalize(action.payload.followers, payloadSchema);
      newState.byId = mergeWith(
        {},
        state.byId,
        normalizedPayload.entities.users,
        replaceArray,
      );
      newState.allIds = union(state.allIds, normalizedPayload.result);
      return newState;
    case RECEIVE_USER_LIKES:
      newCurrentUser = {
        [action.payload.userId]: {
          likeCount: action.payload.likeCount,
        }
      };
      newState = {
        byId: mergeWith({}, state.byId, newCurrentUser, replaceArray),
        allIds: union(state.allIds, [action.payload.userId]),
      };
      // instead of merging the likedPosts objects, replace with the new object
      // to account for scenario when user unlikes a post, and hence remove an entry from likedPosts
      newState.byId[action.payload.userId].likedPosts = action.payload.likedPosts;
      return newState;
    case RECEIVE_USERS:
      if (!action.payload.length) return state; // searching for users may return empty array
      payloadSchema = [userSchema];
      normalizedPayload = normalize(action.payload, payloadSchema);
      newState.byId = mergeWith(
        {},
        state.byId,
        normalizedPayload.entities.users,
        replaceArray,
      );
      newState.allIds = union(
        state.allIds,
        Object.keys(normalizedPayload.entities.users),
      );
      return newState;
    case RECEIVE_CURRENT_USER:
      normalizedPayload = normalize(action.payload, userSchema);
      newState = {
        byId: mergeWith({}, state.byId, normalizedPayload.entities.users, replaceArray),
        allIds: union(state.allIds, [action.payload._id]),
      };
      return newState;
    case REMOVE_CURRENT_USER:
      return defaultState;
    default:
      return state;
  }
}

export default usersReducer;