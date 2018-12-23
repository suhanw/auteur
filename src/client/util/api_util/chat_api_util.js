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