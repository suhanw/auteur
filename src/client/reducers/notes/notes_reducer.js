import { normalize, schema } from 'normalizr';
import { merge, union } from 'lodash';
import { RECEIVE_NOTE } from '../../actions/note_actions';

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
      normalizedPayload = normalize(action.payload, noteSchema);
      newState.byId = merge(
        {},
        state.byId,
        normalizedPayload.entities.notes
      );
      newState.allIds = union(state.allIds, [action.payload._id]);
      return newState;
    default:
      return state;
  };
};

export default notesReducer;