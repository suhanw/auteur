import { merge } from 'lodash';
import { CLOSE_MODAL } from '../../actions/modal_actions';
import { CONFIRM_DELETE_POST, REMOVE_POST } from '../../actions/post_actions';

const defaultState = {
  confirmLogout: false,
  confirmDeletePost: null,
}

const modalsReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case CONFIRM_DELETE_POST:
      newState = merge({}, state);
      newState.confirmDeletePost = action.payload;
      return newState;
    case REMOVE_POST:
      newState = merge({}, state);
      newState.confirmDeletePost = null;
      return newState;
    case CLOSE_MODAL:
      return defaultState;
    default:
      return state;
  }
};

export default modalsReducer;