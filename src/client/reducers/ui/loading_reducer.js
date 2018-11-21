import { merge } from 'lodash';
import { RECEIVE_POST_SUBMIT } from '../../actions/loading_actions';
import { RECEIVE_POST } from '../../actions/post_actions';

const defaultState = {
  loadingPostIndex: false,
  loadingPostSubmit: false,
};

const loadingReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case RECEIVE_POST_SUBMIT:
      newState = merge({}, state);
      newState.loadingPostSubmit = true;
      return newState;
    case RECEIVE_POST:
      newState = merge({}, state);
      newState.loadingPostSubmit = false;
      return newState;
    default:
      return state;
  };
};

export default loadingReducer;