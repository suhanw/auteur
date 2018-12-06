import { normalize, schema } from 'normalizr';
import { merge, union } from 'lodash';
import { RECEIVE_NOTE, REMOVE_NOTE, RECEIVE_NOTES } from '../../actions/note_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

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

let payloadSchema;
let normalizedPayload;

const notesReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case RECEIVE_NOTES:
      payloadSchema = [noteSchema];
      normalizedPayload = normalize(action.payload.notes, payloadSchema);
      newState.byId = merge(
        {},
        state.byId,
        normalizedPayload.entities.notes
      );
      newState.allIds = union(state.allIds, normalizedPayload.result);
      return newState;
    case RECEIVE_NOTE:
      normalizedPayload = normalize(action.payload, noteSchema);
      newState.byId = merge(
        {},
        state.byId,
        normalizedPayload.entities.notes
      );
      newState.allIds = union(state.allIds, [action.payload._id]);
      return newState;
    case REMOVE_NOTE:
      const deletedNoteId = action.payload._id;
      newState.byId = merge({}, state.byId);
      delete newState.byId[deletedNoteId];
      newState.allIds = state.allIds.slice();
      newState.allIds = newState.allIds.filter((noteId) => noteId !== deletedNoteId);
      return newState;
    case REMOVE_CURRENT_USER:
      return defaultState;
    default:
      return state;
  };
};

export default notesReducer;