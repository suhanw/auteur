import {merge} from 'lodash';
import {RECEIVE_CURRENT_USER} from '../../actions/session_actions';

const sessionReducer = function(state = {id: null}, action) {
  let newState;
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      newState = merge(state, {id: action.payload._id});
      return newState;
    default:
      return state;
  }
}

export default sessionReducer;
