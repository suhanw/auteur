export const fetchUserLikes = function (userId, queryParams) {
  let queryString = '';
  if (queryParams) {
    queryString += '?';
    for (let key in queryParams) {
      queryString += `${key}=${queryParams[key]}&`
    }
  }
  return $.ajax({
    method: 'GET',
    url: `/api/users/${userId}/likes/${queryString}`,
  });
};