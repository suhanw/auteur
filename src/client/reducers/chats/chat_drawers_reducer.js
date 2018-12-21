import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

const defaultState = {
  activeChat: null, // this will appear as chat drawer
  openChats: [], // this will appear as avatar(s) on the side
};

const chatDrawersReducer = function (state = defaultState, action) {
  switch (action.type) {
    case REMOVE_CURRENT_USER:
      return defaultState;
    default:
      return state;
  }
}

export default chatDrawersReducer;