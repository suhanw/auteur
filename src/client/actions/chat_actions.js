export const OPEN_CHAT_DRAWER = 'OPEN_CHAT_DRAWER';
export const CLOSE_CHAT_DRAWER = 'CLOSE_CHAT_DRAWER';

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