import { merge } from 'lodash';
import { normalize, schema } from 'normalizr';
import { RECEIVE_SEARCH_USERS } from '../../actions/search_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

const defaultState = {
  users: [],
  posts: [], // TODO: move search posts from postIndex slice to this slice
};

const userSchema = new schema.Entity(
  'users',
  {},
  { idAttribute: '_id' }
);

let payloadSchema;
let normalizedPayload;

const searchReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case RECEIVE_SEARCH_USERS:
      payloadSchema = [userSchema];
      normalizedPayload = normalize(action.payload, payloadSchema);
      newState = merge({}, state);
      newState.users = normalizedPayload.result; // array of user Ids
      return newState;
    case REMOVE_CURRENT_USER:
      return defaultState;
    default:
      return state;
  }
};

export default searchReducer;

