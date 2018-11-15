import { RECEIVE_BLOG_ERRORS, RECEIVE_BLOG } from '../../actions/blog_actions';

const blogErrorsReducer = function (state = [], action) {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_BLOG_ERRORS:
      return action.payload;
    case RECEIVE_BLOG:
      return [];
    default:
      return state;
  };
};

export default blogErrorsReducer;