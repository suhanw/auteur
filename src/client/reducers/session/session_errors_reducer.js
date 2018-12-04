import { CLEAR_ERRORS } from '../../actions/clear_actions';
import { RECEIVE_SESSION_ERRORS, RECEIVE_CURRENT_USER, REMOVE_CURRENT_USER } from '../../actions/session_actions';

const sessionErrorsReducer = function (state = [], action) {
  Object.freeze(state);
  let newState;
  switch (action.type) {
    case RECEIVE_SESSION_ERRORS:
      newState = action.payload;
      return newState;
    case RECEIVE_CURRENT_USER:
      newState = [];
      return newState;
    case REMOVE_CURRENT_USER:
      return [];
    case CLEAR_ERRORS:
      return [];
    default:
      return state;
  };
};

export default sessionErrorsReducer;
