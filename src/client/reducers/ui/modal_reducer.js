import { CLOSE_MODAL } from '../../actions/modal_actions';
import { CONFIRM_DELETE_POST, CHOOSE_POST_TYPE } from '../../actions/post_actions';
import { CONFIRM_DELETE_COMMENT } from '../../actions/note_actions';
import { CONFIRM_LOGOUT, REMOVE_CURRENT_USER } from '../../actions/session_actions';

const modalsReducer = function (state = null, action) {
  Object.freeze(state);
  switch (action.type) {
    case CONFIRM_DELETE_POST:
      return action.payload;
    case CONFIRM_DELETE_COMMENT:
      return action.payload;
    case CONFIRM_LOGOUT:
      return action.payload;
    case CHOOSE_POST_TYPE:
      return action.payload;
    case REMOVE_CURRENT_USER:
      return null;
    case CLOSE_MODAL:
      return null;
    default:
      return state;
  }
};

export default modalsReducer;