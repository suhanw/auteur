import { merge } from 'lodash';
import { CLOSE_MODAL } from '../../actions/modal_actions';
import { CONFIRM_DELETE_POST, REMOVE_POST } from '../../actions/post_actions';

const modalsReducer = function (state = null, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case CONFIRM_DELETE_POST:
      return 'confirmDeletePost';
    case REMOVE_POST:
      return null;
    case CLOSE_MODAL:
      return null;
    default:
      return state;
  }
};

export default modalsReducer;