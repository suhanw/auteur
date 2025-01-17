import { combineReducers } from 'redux';
import usersReducer from './users/users_reducer';
import postsReducer from './posts/posts_reducer';
import blogsReducer from './blogs/blogs_reducer';
import notesReducer from './notes/notes_reducer';
import tagsReducer from './search/tags_reducer';
import chatRoomsReducer from './chats/chat_rooms_reducer';
import chatMessagesReducer from './chats/chat_messages_reducer';
import notificationsReducer from './notifications/notifications_reducer';

const entitiesReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  blogs: blogsReducer,
  notes: notesReducer,
  tags: tagsReducer,
  chatRooms: chatRoomsReducer,
  chatMessages: chatMessagesReducer,
  notifications: notificationsReducer,
});

export default entitiesReducer;
