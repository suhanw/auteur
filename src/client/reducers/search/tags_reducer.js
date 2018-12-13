import { merge, union } from 'lodash';
import { schema, normalize } from 'normalizr';
import { RECEIVE_TAGS } from '../../actions/search_actions';

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
      // newState.byId = merge({}, normalizedPayload.entities.tags, state.byId);
      // newState.allIds = union(normalizedPayload.result, state.allIds);
      newState.byId = normalizedPayload.entities.tags;
      newState.allIds = normalizedPayload.result;
      return newState;
    default:
      return state;
  }
}

export default tagsReducer;