import { combineReducers } from 'redux';
import usersReducer from './users/users_reducer';
import postsReducer from './posts/posts_reducer';
import blogsReducer from './blogs/blogs_reducer';
import notesReducer from './notes/notes_reducer';

const entitiesReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  blogs: blogsReducer,
  notes: notesReducer,
});

export default entitiesReducer;
