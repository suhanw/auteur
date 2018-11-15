import { SCROLLING } from '../../actions/ui_actions';

const scrollReducer = function (state = 0, action) {
  switch (action.type) {
    case SCROLLING:
      return action.payload;
    default:
      return state;
  };
};

export default scrollReducer;