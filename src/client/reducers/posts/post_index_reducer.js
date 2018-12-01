import { RECEIVE_POSTS, RECEIVE_POST, REMOVE_POST } from '../../actions/post_actions';
import { RECEIVE_USER_FOLLOWING } from '../../actions/user_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';
import { normalize, schema } from 'normalizr';
import { merge, union } from 'lodash';

const defaultState = {
  feed: [],
  following: [],
  likes: [],
  blogId: null, // if populated, pull the posts from the 'blogs' state
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
    case RECEIVE_USER_FOLLOWING:
      payloadSchema = [postSchema];
      normalizedPayload = normalize(action.payload, payloadSchema);
      newState = merge({}, state);
      // FIX: this replaces the array everytime user clicks on Following, because this array doesn't update when user unfollows a blog
      newState.following = normalizedPayload.result; // array of postIds
      return newState;
    case RECEIVE_POSTS: // used for fetching feed posts
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
      if (state.feed.indexOf(action.payload._id) < 0) {
        // insert latest post into beginning of array
        newState.feed.unshift(action.payload._id);
      } else {
        // else, the received post might be an updated post
        newState.feed = union(
          state.feed,
          [action.payload._id]
        );
      }
      return newState;
    case REMOVE_POST:
      let removedPostId = action.payload;
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