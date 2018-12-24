export const fetchTags = function (tagQuery) {
  return $.ajax({
    method: 'GET',
    url: `/api/search/tags?q=${tagQuery}`,
  });
};

export const fetchSearchPosts = function (tagQuery) {
  return $.ajax({
    method: 'GET',
    url: `/api/search/posts?q=${tagQuery}`,
  });
};

export const fetchSearchUsers = function (userQuery) {
  return $.ajax({
    method: 'GET',
    url: `/api/search/users?q=${userQuery}`,
  });
};