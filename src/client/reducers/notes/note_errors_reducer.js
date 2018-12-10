import { CLEAR_ERRORS } from '../../actions/clear_actions';
import { RECEIVE_NOTE_ERRORS, RECEIVE_NOTES, RECEIVE_NOTE, REMOVE_NOTE } from '../../actions/note_actions';

const noteErrorsReducer = function (state = [], action) {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_NOTE_ERRORS:
      return action.payload;
    case RECEIVE_NOTES:
      return [];
    case RECEIVE_NOTE:
      return [];
    case REMOVE_NOTE:
      return [];
    case CLEAR_ERRORS:
      return [];
    default:
      return state;
  };
};

export default noteErrorsReducer;