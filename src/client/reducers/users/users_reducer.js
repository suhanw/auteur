import { mergeWith, union } from 'lodash';
import { normalize, schema } from 'normalizr';
import { RECEIVE_CURRENT_USER, REMOVE_CURRENT_USER } from '../../actions/session_actions';
import { RECEIVE_BLOG } from '../../actions/blog_actions';
import { FOLLOW_BLOG, UNFOLLOW_BLOG } from '../../actions/follow_actions';
import { RECEIVE_NOTE, REMOVE_NOTE } from '../../actions/note_actions';
import { RECEIVE_USERS } from '../../actions/user_actions';
import { replaceArray } from '../../util/misc_util';

const defaultState = {
  byId: {},
  allIds: [],
};

const userSchema = new schema.Entity(
  'users',
  {
    primaryBlog: new schema.Entity(
      'blogs',
      { author: userSchema },
      { idAttribute: '_id' }
    )
  },
  { idAttribute: '_id' }
);

const blogSchema = new schema.Entity(
  'blogs',
  { author: userSchema },
  { idAttribute: '_id' }
);

const postSchema = new schema.Entity(
  'posts',
  { idAttribute: '_id' }
);

const noteSchema = new schema.Entity(
  'notes',
  {
    author: userSchema,
    post: postSchema
  },
  { idAttribute: '_id' }
);

let payloadSchema;
let normalizedPayload;

const usersReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  let newCurrentUser = {};
  switch (action.type) {
    case RECEIVE_NOTE:
      normalizedPayload = normalize(action.payload, noteSchema);
      newState.byId = mergeWith(
        {},
        state.byId,
        normalizedPayload.entities.users,
        replaceArray,
      );
      newState.allIds = union(
        state.allIds,
        [action.payload.author._id]
      );
      return newState;
    case REMOVE_NOTE:
      normalizedPayload = normalize(action.payload, noteSchema);
      newState.byId = mergeWith(
        {},
        state.byId,
        normalizedPayload.entities.users,
        replaceArray,
      );
      newState.allIds = union(
        state.allIds,
        [action.payload.author._id]
      );
      return newState;
    case RECEIVE_BLOG:
      normalizedPayload = normalize(action.payload, blogSchema);
      newState.byId = mergeWith(
        {},
        state.byId,
        normalizedPayload.entities.users,
        replaceArray,
      );
      newState.allIds = union(
        state.allIds,
        [action.payload.author._id]
      );
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
        byId: mergeWith({}, state.byId, newCurrentUser, replaceArray),
        allIds: union(state.allIds, [action.payload._id]),
      };
      return newState;
    case RECEIVE_USERS:
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
      newCurrentUser = { [action.payload._id]: action.payload };
      newState = {
        byId: mergeWith({}, state.byId, newCurrentUser, replaceArray),
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