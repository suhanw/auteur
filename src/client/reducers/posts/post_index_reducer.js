import { RECEIVE_POSTS, RECEIVE_POST, REMOVE_POST } from '../../actions/post_actions';
import { normalize, schema } from 'normalizr';
import { union } from 'lodash';

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
    case RECEIVE_POSTS:
      payloadSchema = [postSchema];
      normalizedPayload = normalize(action.payload, payloadSchema);
      newState.feed = union(
        state.feed,
        normalizedPayload.result, // array of postIds
      );
      return newState;
    case RECEIVE_POST:
      normalizedPayload = normalize(action.payload, postSchema);
      if (state.feed.indexOf(action.payload._id) < 0) {
        newState.feed = state.feed.slice();
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
      newState.feed = state.feed.slice();
      newState.feed = newState.feed.filter((postId) => postId !== removedPostId)
      return newState;
    default:
      return state;
  }
};

export default postIndexReducer;