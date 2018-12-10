import { combineReducers } from 'redux';
import sessionErrorsReducer from './session/session_errors_reducer';
import blogErrorsReducer from './blogs/blog_errors_reducer';
import postErrorsReducer from './posts/post_errors_reducer';
import noteErrorsReducer from './notes/note_errors_reducer';

const errorsReducer = combineReducers({
  sessionErrors: sessionErrorsReducer,
  postErrors: postErrorsReducer,
  blogErrors: blogErrorsReducer,
  noteErrors: noteErrorsReducer,
});

export default errorsReducer;
