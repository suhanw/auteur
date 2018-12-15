import { combineReducers } from 'redux';
import navbarReducer from './ui/navbar_reducer';
import loadingReducer from './ui/loading_reducer';
import modalReducer from './ui/modal_reducer';
import popoverReducer from './ui/popover_reducer';
import drawerReducer from './ui/drawer_reducer';
import postIndexReducer from './posts/post_index_reducer';

const uiReducer = combineReducers({
  navbar: navbarReducer,
  loading: loadingReducer,
  modal: modalReducer,
  popover: popoverReducer,
  drawer: drawerReducer,
  postIndex: postIndexReducer,
});

export default uiReducer;