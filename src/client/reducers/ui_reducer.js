import { combineReducers } from 'redux';
import loadingReducer from './ui/loading_reducer.js';
import modalsReducer from './ui/modals_reducer.js';

const uiReducer = combineReducers({
  loading: loadingReducer,
  modals: modalsReducer,
});

export default uiReducer;