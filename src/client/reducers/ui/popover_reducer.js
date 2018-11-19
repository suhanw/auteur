import { OPEN_POPOVER, CLOSE_POPOVER } from '../../actions/popover_actions';

const popoverReducer = function (state = false, action) {
  Object.freeze(state);
  switch (action.type) {
    case OPEN_POPOVER:
      return true;
    case CLOSE_POPOVER:
      return false;
    default:
      return state;
  }
};

export default popoverReducer;