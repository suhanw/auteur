export const RECEIVE_NOTIFICATIONS = 'RECEIVE_NOTIFICATIONS';

export const receiveNotifications = function (notifications) {
  return {
    type: RECEIVE_NOTIFICATIONS,
    payload: notifications,
  };
};

