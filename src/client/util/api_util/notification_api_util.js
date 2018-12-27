export const createNotification = function (notification) {
  return $.ajax({
    method: 'post',
    url: '/api/notifications',
    data: notification,
  });
};