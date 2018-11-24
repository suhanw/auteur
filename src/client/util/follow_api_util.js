export const createFollow = function (blogId) {
  return $.ajax({
    url: `/api/blogs/${blogId}/follows`,
    method: 'POST',
  });
};

export const deleteFollow = function (blogId) {
  return $.ajax({
    url: `/api/blogs/${blogId}/follows`,
    method: 'DELETE',
  });
};

export const fetchFollowers = function (blogId) {
  return $.ajax({
    url: `/api/blogs/${blogId}/follows`,
    method: 'GET',
  });
};