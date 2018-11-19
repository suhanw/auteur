import { RECEIVE_CURRENT_USER, REMOVE_CURRENT_USER } from '../../actions/session_actions';

const sessionReducer = function (state = { id: null }, action) {
  Object.freeze(state);
  let newState;
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      newState = { id: action.payload._id };
      return newState;
    case REMOVE_CURRENT_USER:
      newState = { id: null };
      return newState;
    default:
      return state;
  }
}

export default sessionReducer;
