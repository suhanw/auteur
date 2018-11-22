import { OPEN_POPOVER, CLOSE_POPOVER } from '../../actions/popover_actions';

const popoverReducer = function (state = null, action) {
  Object.freeze(state);
  switch (action.type) {
    case OPEN_POPOVER:
      // there can only be one open popover at any given time
      return action.payload;
    case CLOSE_POPOVER:
      return null;
    default:
      return state;
  }
};

export default popoverReducer;