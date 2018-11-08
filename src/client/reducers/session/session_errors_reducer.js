import {merge} from 'lodash';
import {RECEIVE_SESSION_ERRORS, RECEIVE_CURRENT_USER} from '../../actions/session_actions';

const sessionErrorsReducer = function(state = [], action) {
  let newState;
  switch (action.type) {
    case RECEIVE_SESSION_ERRORS:
      newState = action.payload;
      return newState;
    default:
      return state;
  };
};

export default sessionErrorsReducer;
