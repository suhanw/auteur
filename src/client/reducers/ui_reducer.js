import { combineReducers } from 'redux';
import loadingReducer from './ui/loading_reducer.js';
import modalReducer from './ui/modal_reducer.js';
import popoverReducer from './ui/popover_reducer.js';

const uiReducer = combineReducers({
  loading: loadingReducer,
  modal: modalReducer,
  popover: popoverReducer,
});

export default uiReducer;