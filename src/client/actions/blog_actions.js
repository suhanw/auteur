import * as APIUtil from '../util/api_util/blog_api_util';

export const RECEIVE_BLOGS = 'RECEIVE_BLOGS';
export const RECEIVE_BLOG = 'RECEIVE_BLOG';
export const RECEIVE_BLOG_ERRORS = 'RECEIVE_BLOG_ERRORS';

export const receiveBlogs = function (blogs) {
  return {
    type: RECEIVE_BLOGS,
    payload: blogs,
  };
};

export const receiveBlog = function (blog) {
  return {
    type: RECEIVE_BLOG,
    payload: blog,
  };
};

export const receiveBlogErrors = function (errors) {
  return {
    type: RECEIVE_BLOG_ERRORS,
    payload: errors,
  };
};

export const fetchBlog = function (blogId, queryParams) {
  return function (dispatch) {
    return APIUtil.fetchBlog(blogId).then(
      (blog) => dispatch(receiveBlog(blog)),
      (err) => dispatch(receiveBlogErrors(err.responseJSON)),
    );
  };
};