import { schema, normalize } from 'normalizr';
import { merge, union } from 'lodash';
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

const chatRoomsReducer = function (state = {}, action) {
  Object.freeze(state);
  let newState = {};
  switch (action.type) {
    case RECEIVE_CHAT_MESSAGE:
      newState = merge({}, state); // corresponding chatRoom should already be fetched
      const chatMessage = action.payload;
      newState[chatMessage.chatPartner].messages = union([chatMessage._id], state[chatMessage.chatPartner].messages);
      return newState;
    case RECEIVE_CHAT_ROOM:
      normalizedPayload = normalize(action.payload, chatRoomSchema);
      newState = merge(
        {},
        state,
        normalizedPayload.entities.chatRooms,
      );
      return newState;
    case REMOVE_CURRENT_USER:
      return {};
    default:
      return state;
  }
};

export default chatRoomsReducer;