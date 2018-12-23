import { schema, normalize } from 'normalizr';
import { merge } from 'lodash';
import { RECEIVE_CHAT_ROOM, RECEIVE_CHAT_MESSAGE } from '../../actions/chat_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

const userSchema = new schema.Entity('users', {}, { idAttribute: '_id' });

const chatMessageSchema = new schema.Entity('chatMessages', {}, { idAttribute: '_id' });

const chatRoomSchema = new schema.Entity('chatRooms',
  {
    participants: [userSchema],
    messages: [chatMessageSchema],
  },
  { idAttribute: 'chatPartner' }); // chatPartner should be unique, cos current user can only have one unique chat room with a given user

let payloadSchema;
let normalizedPayload;

const chatMessagesReducer = function (state = {}, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case RECEIVE_CHAT_MESSAGE:
      normalizedPayload = normalize(action.payload, chatMessageSchema);
      newState = merge(
        {},
        state,
        normalizedPayload.entities.chatMessages,
      );
      return newState;
    case RECEIVE_CHAT_ROOM:
      normalizedPayload = normalize(action.payload, chatRoomSchema);
      newState = merge(
        {},
        state,
        normalizedPayload.entities.chatMessages,
      );
      return newState;
    case REMOVE_CURRENT_USER:
      return {};
    default:
      return state;
  }
};

export default chatMessagesReducer;