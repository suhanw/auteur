export const fetchChatRoom = function (chatPartner) {
  return $.ajax({
    method: 'get',
    url: `/api/chats/${chatPartner}`
  });
};

export const createChatRoom = function (chatPartner) {
  return $.ajax({
    method: 'post',
    url: '/api/chats',
    data: { chatPartner },
  });
};

export const fetchChatMessage = function (chatPartner, chatRoomId) {
  return $.ajax({
    method: 'get',
    url: `/api/chats/${chatPartner}/messages/?chatRoomId=${chatRoomId}`,
  });
};

export const createChatMessage = function (chatPartner, chatMessage) {
  return $.ajax({
    method: 'post',
    url: `/api/chats/${chatPartner}/messages`,
    data: { chatMessage },
  });
};