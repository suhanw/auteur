import { NAVBAR } from '../../actions/navbar_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

const navbarReducer = function (state = null, action) {
  Object.freeze(state);
  let newState;
  switch (action.type) {
    case NAVBAR:
      newState = action.payload;
      return newState;
    case REMOVE_CURRENT_USER:
      return null;
    default:
      return state;
  }
};

export default navbarReducer;