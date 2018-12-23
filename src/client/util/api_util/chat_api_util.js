export const createChatRoom = function (chatPartner) {
  return $.ajax({
    method: 'post',
    url: '/api/chats',
    data: { chatPartner },
  });
};