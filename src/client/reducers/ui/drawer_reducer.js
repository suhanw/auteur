import { OPEN_DRAWER, CLOSE_DRAWER } from '../../actions/drawer_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

const drawerReducer = function (state = null, action) {
  Object.freeze(state);
  switch (action.type) {
    case OPEN_DRAWER:
      // only one open drawer at a time
      return action.payload;
    case CLOSE_DRAWER:
      return null;
    case REMOVE_CURRENT_USER:
      return null;
    default:
      return state;
  }
};

export default drawerReducer;