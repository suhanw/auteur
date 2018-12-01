export const fetchBlog = function (blogId, queryParams) {
  // let queryString = '';
  // if (queryParams) {
  //   queryString += '?';
  //   for (let key in queryParams) {
  //     queryString += `${key}=${queryParams[key]}&`
  //   }
  // }
  return $.ajax({
    method: 'GET',
    url: `api/blogs/${blogId}`,
  });
};

