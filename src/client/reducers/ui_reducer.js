import { combineReducers } from 'redux';
import navbarReducer from './ui/navbar_reducer';
import loadingReducer from './ui/loading_reducer';
import modalReducer from './ui/modal_reducer';
import popoverReducer from './ui/popover_reducer';
import drawerReducer from './ui/drawer_reducer';
import chatDrawersReducer from './chats/chat_drawers_reducer';
import postIndexReducer from './posts/post_index_reducer';
import searchReducer from './search/search_reducer';

const uiReducer = combineReducers({
  navbar: navbarReducer,
  loading: loadingReducer,
  modal: modalReducer,
  popover: popoverReducer,
  drawer: drawerReducer,
  chatDrawers: chatDrawersReducer,
  postIndex: postIndexReducer,
  search: searchReducer,
});

export default uiReducer;