import { OPEN_POPOVER, CLOSE_POPOVER } from '../../actions/popover_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

const popoverReducer = function (state = null, action) {
  Object.freeze(state);
  switch (action.type) {
    case OPEN_POPOVER:
      // there can only be one open popover at any given time
      return action.payload;
    case CLOSE_POPOVER:
      return null;
    case REMOVE_CURRENT_USER:
      return null;
    default:
      return state;
  }
};

export default popoverReducer;