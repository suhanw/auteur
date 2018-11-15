import { combineReducers } from 'redux';
import scrollReducer from './ui/scroll_reducer';

const uiReducer = combineReducers({
  scrollTop: scrollReducer, // to offset avatar as user scrolls down
});

export default uiReducer;