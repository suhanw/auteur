import { CLEAR_ERRORS } from '../../actions/clear_actions';
import { RECEIVE_CHAT_ERRORS, RECEIVE_CHAT_ROOM } from '../../actions/chat_actions';

const chatErrorsReducer = function (state = [], action) {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CHAT_ERRORS:
      return action.payload;
    case RECEIVE_CHAT_ROOM:
      return [];
    case CLEAR_ERRORS:
      return [];
    default:
      return state;
  }
}

export default chatErrorsReducer;