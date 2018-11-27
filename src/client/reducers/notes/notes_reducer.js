import { normalize, schema } from 'normalizr';
import { merge, union } from 'lodash';
import { RECEIVE_NOTE, REMOVE_NOTE } from '../../actions/note_actions';

const defaultState = {
  byId: {},
  allIds: [],
};

const userSchema = new schema.Entity('users',
  {},
  { idAttribute: '_id' });

const postSchema = new schema.Entity('posts',
  {},
  { idAttribute: '_id' });

const noteSchema = new schema.Entity('notes',
  {
    post: postSchema,
    author: userSchema,
  },
  { idAttribute: '_id' });

const notesReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let normalizedPayload;
  let newState = {};
  switch (action.type) {
    case RECEIVE_NOTE:
      if (!action.payload) return state;
      normalizedPayload = normalize(action.payload, noteSchema);
      newState.byId = merge(
        {},
        state.byId,
        normalizedPayload.entities.notes
      );
      newState.allIds = union(state.allIds, [action.payload._id]);
      return newState;
    case REMOVE_NOTE:
      const noteId = action.payload._id;
      newState.byId = merge({}, state.byId);
      delete newState.byId[noteId];
      newState.allIds = state.allIds.slice();
      const indexToDel = newState.allIds.indexOf(noteId);
      newState.allIds = union(state.allIds, [action.payload._id]);
      newState.allIds.splice(indexToDel, 1);
      return newState;
    default:
      return state;
  };
};

export default notesReducer;