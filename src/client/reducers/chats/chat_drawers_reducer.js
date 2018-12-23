import { OPEN_CHAT_DRAWER, CLOSE_CHAT_DRAWER } from '../../actions/chat_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';
import { merge } from 'lodash';

const defaultState = {
  activeChatPartner: null, // this will appear as chat drawer
  minimizedChats: [], // this will appear as avatar(s) on the side
};

const chatDrawersReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case OPEN_CHAT_DRAWER:
      newState = merge({}, state);
      newState.activeChatPartner = action.payload;
      return newState;
    case CLOSE_CHAT_DRAWER:
      newState = merge({}, state);
      newState.activeChatPartner = null;
      return newState;
    case REMOVE_CURRENT_USER:
      return defaultState;
    default:
      return state;
  }
}

export default chatDrawersReducer;