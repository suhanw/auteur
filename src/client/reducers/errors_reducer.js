import {combineReducers} from 'redux';
import sessionErrorsReducer from './session/session_errors_reducer';

const errorsReducer = combineReducers({
  sessionErrors: sessionErrorsReducer,
});

export default errorsReducer;
