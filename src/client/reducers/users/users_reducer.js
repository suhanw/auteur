import { merge, union } from 'lodash';
import { normalize, schema } from 'normalizr';
import { RECEIVE_CURRENT_USER } from '../../actions/session_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';
import { RECEIVE_BLOG } from '../../actions/blog_actions';

const defaultState = {
  byId: {},
  allIds: [],
};

const userSchema = new schema.Entity(
  'users',
  {},
  { idAttribute: '_id' }
);

const blogSchema = new schema.Entity(
  'blogs',
  { author: userSchema },
  { idAttribute: '_id' }
);

let payloadSchema;
let normalizedPayload;

const usersReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case RECEIVE_BLOG:
      normalizedPayload = normalize(action.payload, blogSchema);
      newState.byId = merge(
        {},
        state.byId,
        normalizedPayload.entities.users,
      );
      newState.allIds = union(
        state.allIds,
        [action.payload.author._id]
      );
      return newState;
    case RECEIVE_CURRENT_USER:
      newState = {
        byId: { [action.payload._id]: action.payload },
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
