import {schema, normalize} from 'normalizr';
import {merge, union} from 'lodash';
import {RECEIVE_CURRENT_USER} from '../actions/session_actions';

const defaultState = {
  byId: {},
  allIds: [],
};

const usersReducer = function(state = defaultState, action) {
  Object.freeze(state);
  let newState;
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      newState = {
        byId: {[action.payload._id]: action.payload},
        allIds: union(state.allIds, [action.payload._id]),
      };
      return newState;
    default:
      return state;
  }
}

export default usersReducer;
