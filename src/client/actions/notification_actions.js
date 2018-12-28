import * as APIUtil from '../util/api_util/notification_api_util';

export const RECEIVE_NOTIFICATIONS = 'RECEIVE_NOTIFICATIONS';
export const RECEIVE_UNREAD_NOTIFICATION_COUNT = 'RECEIVE_UNREAD_NOTIFICATION_COUNT';
export const RECEIVE_NOTIFICATION_ERRORS = 'RECEIVE_NOTIFICATION_ERRORS';

export const receiveNotifications = function (notifications) {
  return {
    type: RECEIVE_NOTIFICATIONS,
    payload: notifications,
  };
};

export const receiveUnreadNotificationCount = function (unreadCount) {
  return {
    type: RECEIVE_UNREAD_NOTIFICATION_COUNT,
    payload: unreadCount,
  };
};

export const receiveNotificationErrors = function (errors) {
  return {
    type: RECEIVE_NOTIFICATION_ERRORS,
    payload: errors,
  };
};

export const fetchNotifications = function () {
  return function (dispatch) {
    return APIUtil.fetchNotifications().then(
      (notifications) => dispatch(receiveNotifications(notifications)),
      (err) => dispatch(receiveNotificationErrors(err.responseJSON)),
    );
  };
};

export const fetchUnreadNotificationCount = function () {
  return function (dispatch) {
    return APIUtil.fetchNotifications({ countUnread: true }).then(
      (unreadCount) => dispatch(receiveUnreadNotificationCount(unreadCount)),
      (err) => dispatch(receiveNotificationErrors(err.responseJSON)),
    );
  };
};

export const createNotification = function (notification) {
  return function (dispatch) {
    return APIUtil.createNotification(notification).then(
      (notification) => dispatch({ type: 'RECEIVE_NOTIFICATION', payload: notification }), // no response needed for the person likeing or commenting
      (err) => dispatch(receiveNotificationErrors(err.responseJSON)),
    );
  };
};