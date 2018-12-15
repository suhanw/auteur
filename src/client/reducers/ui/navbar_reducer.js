import { NAVBAR } from '../../actions/navbar_actions';

const navbarReducer = function (state = null, action) {
  Object.freeze(state);
  let newState;
  switch (action.type) {
    case NAVBAR:
      newState = action.payload;
      return newState;
    default:
      return state;
  }
};

export default navbarReducer;