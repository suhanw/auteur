import { combineReducers } from 'redux';
import loadingReducer from './ui/loading_reducer.js';
import modalReducer from './ui/modal_reducer.js';

const uiReducer = combineReducers({
  loading: loadingReducer,
  modal: modalReducer,
});

export default uiReducer;