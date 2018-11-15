import { combineReducers } from 'redux';
import loadingReducer from './ui/loading_reducer.js';

const uiReducer = combineReducers({
  loading: loadingReducer,
});

export default uiReducer;