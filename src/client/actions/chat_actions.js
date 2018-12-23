import * as APIUtil from '../util/api_util/chat_api_util';

export const OPEN_CHAT_DRAWER = 'OPEN_CHAT_DRAWER';
export const CLOSE_CHAT_DRAWER = 'CLOSE_CHAT_DRAWER';
export const RECEIVE_CHAT_ROOM = 'RECEIVE_CHAT_ROOM';
export const RECEIVE_CHAT_ERRORS = 'RECEIVE_CHAT_ERRORS';

export const openChatDrawer = function (chatDrawer) {
  return {
    type: OPEN_CHAT_DRAWER,
    payload: chatDrawer,
  };
};

export const closeChatDrawer = function (chatDrawer) {
  return {
    type: CLOSE_CHAT_DRAWER,
    payload: chatDrawer,
  };
};

export const receiveChatRoom = function (chatRoom) {
  return {
    type: RECEIVE_CHAT_ROOM,
    payload: chatRoom,
  };
};

export const receiveChatErrors = function (errors) {
  return {
    type: RECEIVE_CHAT_ERRORS,
    payload: errors,
  };
};

export const fetchChatRoom = function (chatPartner) {
  return function (dispatch) {
    return APIUtil.fetchChatRoom(chatPartner).then(
      (chatRoom) => {
        dispatch(receiveChatRoom(chatRoom));
        // doesn't return any value
      },
      (err) => {
        return dispatch(receiveChatErrors(err.responseJSON));
      }
    );
  };
};

export const createChatRoom = function (chatPartner) {
  return function (dispatch) {
    return APIUtil.createChatRoom(chatPartner).then(
      (chatRoom) => {
        dispatch(receiveChatRoom(chatRoom));
        // doesn't return any value
      },
      (err) => {
        return dispatch(receiveChatErrors(err.responseJSON));
      }
    );
  };
};
