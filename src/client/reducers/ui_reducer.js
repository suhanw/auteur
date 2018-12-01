import { combineReducers } from 'redux';
import loadingReducer from './ui/loading_reducer.js';
import modalReducer from './ui/modal_reducer.js';
import popoverReducer from './ui/popover_reducer.js';
import postIndexReducer from './posts/post_index_reducer';

const uiReducer = combineReducers({
  loading: loadingReducer,
  modal: modalReducer,
  popover: popoverReducer,
  postIndex: postIndexReducer,
});

export default uiReducer;