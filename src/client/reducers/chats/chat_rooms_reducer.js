import { schema, normalize } from 'normalizr';
import { merge } from 'lodash';
import { RECEIVE_CHAT_ROOM } from '../../actions/chat_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

// const defaultState = {
//   byId: {},
//   allIds: [],
// };

const userSchema = new schema.Entity('users', {}, { idAttribute: '_id' });

const chatRoomSchema = new schema.Entity('chatRooms',
  {
    participants: [userSchema],
    // messages: [messageSchema] TODO: add this later
  },
  { idAttribute: 'chatPartner' }); // chatPartner should be unique, cos current user can only have one unique chat room with a given user

let payloadSchema;
let normalizedPayload;

const chatRoomsReducer = function (state = {}, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case RECEIVE_CHAT_ROOM:
      normalizedPayload = normalize(action.payload, chatRoomSchema);
      newState = merge(
        {},
        state.byId,
        normalizedPayload.entities.chatRooms,
      );
      return newState;
    case REMOVE_CURRENT_USER:
      return {};
    default:
      return state;
  }
}

export default chatRoomsReducer;