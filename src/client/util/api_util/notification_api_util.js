import { createQueryString } from '../misc_util';

export const createNotification = function (notification) {
  return $.ajax({
    method: 'post',
    url: '/api/notifications',
    data: notification,
  });
};


export const fetchNotifications = function (queryParams) {
  return $.ajax({
    method: 'get',
    url: `/api/notifications/${createQueryString(queryParams)}`,
  });
};