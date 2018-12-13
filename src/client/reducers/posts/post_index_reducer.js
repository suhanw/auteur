import { RECEIVE_FEED, RECEIVE_POST, REMOVE_POST } from '../../actions/post_actions';
import { RECEIVE_SEARCH_POSTS, CLEAR_SEARCH_POSTS } from '../../actions/search_actions';
import { RECEIVE_USER_FOLLOWING, RECEIVE_USER_LIKES } from '../../actions/user_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';
import { normalize, schema } from 'normalizr';
import { merge, union } from 'lodash';

const defaultState = {
  feed: [],
  following: [],
  likes: [],
  searchPosts: [],
};

const blogSchema = new schema.Entity('blogs',
  {},
  { idAttribute: '_id', });

const postSchema = new schema.Entity('posts',
  { blog: blogSchema },
  { idAttribute: '_id' });

let payloadSchema;
let normalizedPayload;

const postIndexReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case RECEIVE_SEARCH_POSTS:
      payloadSchema = [postSchema];
      normalizedPayload = normalize(action.payload, payloadSchema);
      newState = merge({}, state);
      newState.searchPosts = union( // union will remove duplicate posts that have more than 1 matching tag
        state.searchPosts,
        normalizedPayload.result, // array of postIds
      );
      return newState;
    case CLEAR_SEARCH_POSTS:
      newState = merge({}, state);
      newState.searchPosts = [];
      return newState;
    case RECEIVE_USER_FOLLOWING:
      payloadSchema = [postSchema];
      normalizedPayload = normalize(action.payload, payloadSchema);
      newState = merge({}, state);
      // FIX: this replaces the array everytime user clicks on Following, because this array doesn't update when user unfollows a blog
      newState.following = normalizedPayload.result; // array of postIds
      return newState;
    case RECEIVE_USER_LIKES:
      const { likedPosts, likeCount } = action.payload;
      newState = merge({}, state);
      newState.likes = (likeCount > 0) ? Object.keys(likedPosts) : [];
      return newState;
    case RECEIVE_FEED: // used for fetching feed posts
      payloadSchema = [postSchema];
      normalizedPayload = normalize(action.payload, payloadSchema);
      newState = merge({}, state);
      newState.feed = union(
        state.feed,
        normalizedPayload.result, // array of postIds
      );
      return newState;
    case RECEIVE_POST:
      normalizedPayload = normalize(action.payload, postSchema);
      newState = merge({}, state);
      if (!state.feed.includes(action.payload._id) &&
        state.feed[0] < action.payload._id) { // mongoDB Id has timestamp encoded
        // insert latest post into beginning of array
        newState.feed.unshift(action.payload._id);
      } else if (state.feed.includes(action.payload._id)) {
        // else, the received post is an updated post, which is already in array
        newState.feed = union(state.feed, [action.payload._id]);
      } // otherwise, received post is updated, but not yet fetched in feed, so don't add to array until fetched via scrolling
      return newState;
    case REMOVE_POST:
      let removedPostId = action.payload._id;
      newState = merge({}, state);
      newState.feed = newState.feed.filter((postId) => postId !== removedPostId)
      return newState;
    case REMOVE_CURRENT_USER:
      return defaultState;
    default:
      return state;
  }
};

export default postIndexReducer;