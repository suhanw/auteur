import { merge, union } from 'lodash';
import { RECEIVE_NOTE } from '../../actions/note_actions';

const defaultState = {
  byId: {},
  allIds: [],
};

const notesReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case RECEIVE_NOTE:
      newState.byId = merge(
        {},
        state.byId,
        { [action.payload._id]: action.payload }
      );
      newState.allIds = union(state.allIds, [action.payload._id]);
      return newState;
    default:
      return state;
  };
};

export default notesReducer;