import * as APIUtil from '../util/api_util/chat_api_util';

export const OPEN_CHAT_DRAWER = 'OPEN_CHAT_DRAWER';
export const CLOSE_CHAT_DRAWER = 'CLOSE_CHAT_DRAWER';
export const RECEIVE_CHAT_ROOM = 'RECEIVE_CHAT_ROOM';
export const RECEIVE_CHAT_MESSAGE = 'RECEIVE_CHAT_MESSAGE';
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

export const receiveChatMessage = function (chatMessage) {
  return {
    type: RECEIVE_CHAT_MESSAGE,
    payload: chatMessage,
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
      (chatRoom) => dispatch(receiveChatRoom(chatRoom)),
      (err) => dispatch(receiveChatErrors(err.responseJSON))
    );
  };
};

export const createChatRoom = function (chatPartner) {
  return function (dispatch) {
    return APIUtil.createChatRoom(chatPartner).then(
      (chatRoom) => dispatch(receiveChatRoom(chatRoom)),
      (err) => dispatch(receiveChatErrors(err.responseJSON))
    );
  };
};

// TODO: do we need this?
export const fetchChatMessage = function (chatPartner, chatRoomId) {
  return function (dispatch) {
    return APIUtil.fetchChatMessage(chatPartner, chatRoomId).then(
      (chatMessage) => dispatch(receiveChatMessage(chatMessage)),
      (err) => dispatch(receiveChatErrors(err.responseJSON))
    );
  };
};

export const createChatMessage = function (chatPartner, chatMessage) {
  return function (dispatch) {
    return APIUtil.createChatMessage(chatPartner, chatMessage).then(
      (chatMessage) => dispatch(receiveChatMessage(chatMessage)),
      (err) => dispatch(receiveChatErrors(err.responseJSON))
    );
  };
};