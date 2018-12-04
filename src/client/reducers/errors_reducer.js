import { combineReducers } from 'redux';
import sessionErrorsReducer from './session/session_errors_reducer';
import postErrorsReducer from './posts/post_errors_reducer';
import blogErrorsReducer from './blogs/blog_errors_reducer';

const errorsReducer = combineReducers({
  sessionErrors: sessionErrorsReducer,
  postErrors: postErrorsReducer,
  blogErrors: blogErrorsReducer,
});

// FIX: create a clearErrors action for when logging out

export default errorsReducer;
