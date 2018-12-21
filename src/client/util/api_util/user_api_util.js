import { createQueryString } from '../misc_util';

export const fetchUserLikes = function (userId, queryParams) {
  return $.ajax({
    method: 'GET',
    url: `/api/users/${userId}/likes/${createQueryString(queryParams)}`,
  });
};

export const fetchUserFollowing = function (userId, queryParams) {
  return $.ajax({
    method: 'GET',
    url: `/api/users/${userId}/following/${createQueryString(queryParams)}`,
  });
};