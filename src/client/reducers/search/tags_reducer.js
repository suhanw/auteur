import { schema, normalize } from 'normalizr';
import { RECEIVE_TAGS } from '../../actions/search_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

const defaultState = {
  byId: {},
  allIds: [],
};

const tagSchema = new schema.Entity(
  'tags',
  {},
  { idAttribute: '_id' }
);

let payloadSchema;
let normalizedPayload;

const tagsReducer = function (state = defaultState, action) {
  Object.freeze(state)
  let newState = {};
  switch (action.type) {
    case RECEIVE_TAGS:
      payloadSchema = [tagSchema];
      normalizedPayload = normalize(action.payload, payloadSchema);
      newState.byId = normalizedPayload.entities.tags;
      newState.allIds = normalizedPayload.result;
      return newState;
    case REMOVE_CURRENT_USER:
      return defaultState;
    default:
      return state;
  }
}

export default tagsReducer;