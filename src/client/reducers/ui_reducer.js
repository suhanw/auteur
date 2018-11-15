import { combineReducers } from 'redux';
import scrollReducer from './ui/scroll_reducer';

const uiReducer = combineReducers({
  scrollTop: scrollReducer,
});

export default uiReducer;