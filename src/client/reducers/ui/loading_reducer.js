import { merge } from 'lodash';
import { LOAD_POST_SUBMIT, LOAD_POST_INDEX } from '../../actions/loading_actions';
import { RECEIVE_POST, RECEIVE_POSTS } from '../../actions/post_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

const defaultState = {
  loadingPostIndex: false,
  loadingPostSubmit: false,
};

const loadingReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case LOAD_POST_SUBMIT:
      newState = merge({}, state);
      newState.loadingPostSubmit = true;
      return newState;
    case RECEIVE_POST:
      newState = merge({}, state);
      newState.loadingPostSubmit = false;
      return newState;
    case LOAD_POST_INDEX:
      newState = merge({}, state);
      newState.loadingPostIndex = true;
      return newState;
    case RECEIVE_POSTS:
      newState = merge({}, state);
      newState.loadingPostIndex = false;
      return newState;
    case REMOVE_CURRENT_USER:
      return defaultState;
    default:
      return state;
  };
};

export default loadingReducer;