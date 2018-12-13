export const fetchTags = function (tagQuery) {
  return $.ajax({
    method: 'GET',
    url: `/api/search/tags?q=${tagQuery}`,
  });
};