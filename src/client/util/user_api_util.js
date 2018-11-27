export const fetchUserLikes = function (userId) {
  return $.ajax({
    method: 'GET',
    url: `/api/users/${userId}/notes`,
  });
}