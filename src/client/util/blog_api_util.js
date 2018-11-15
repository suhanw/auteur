export const fetchBlog = function (blogId) {
  return $.ajax({
    method: 'GET',
    url: `api/blogs/${blogId}`,
  });
};

