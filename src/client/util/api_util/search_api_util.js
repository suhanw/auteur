export const fetchTags = function (tagQuery) {
  return $.ajax({
    method: 'GET',
    url: `/api/search/tags?q=${tagQuery}`,
  });
};

export const fetchSearchPosts = function (tagQuery) {
  return $.ajax({
    method: 'GET',
    url: `/api/search?q=${tagQuery}`,
  });
};