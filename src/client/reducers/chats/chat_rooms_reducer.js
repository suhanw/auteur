import { schema, normalize } from 'normalizr';
import { merge } from 'lodash';
import { RECEIVE_CHAT_ROOM } from '../../actions/chat_actions';

const defaultState = {
  byId: {},
  allIds: [],
};

const userSchema = new schema.Entity('users', {}, { idAttribute: '_id' });

const chatRoomSchema = new schema.Entity('chatRooms',
  {
    participants: [userSchema],
    // messages: [messageSchema] TODO: add this later
  },
  { idAttribute: '_id' });

let payloadSchema;
let normalizedPayload;

const chatRoomsReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case RECEIVE_CHAT_ROOM:
      normalizedPayload = normalize(action.payload, chatRoomSchema);
      newState.byId = merge(
        {},
        state.byId,
        normalizedPayload.entities.chatRooms,
      );
      return newState;
    default:
      return state;
  }
}

export default chatRoomsReducer;