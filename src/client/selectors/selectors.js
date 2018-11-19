export const selectCurrentUser = function (state) {
  const currentUserId = state.session.id;
  if (!currentUserId) {
    return null;
  }
  const currentUser = state.entities.users.byId[currentUserId];
  return currentUser;
};

export const selectSessionErrors = function (state) {
  const { errors: { sessionErrors } } = state;
  return sessionErrors;
};

export const selectPosts = function (state) {
  const { entities: { posts } } = state;
  let postsArr = posts.allIds.map(function (postId) {
    return posts.byId[postId];
  });
  return postsArr;
};

export const selectPost = function (state, postId) {
  const { entities: { posts: { byId } } } = state;
  let post = byId[postId];
  return post;
}

export const selectBlogs = function (state) {
  const { entities: { blogs } } = state;
  const blogsObj = blogs.byId;
  return blogsObj;
};

export const selectBlog = function (state, blogId) {
  const blog = selectBlogs(state)[blogId];
  return blog;
}

export const selectModal = function (state) {
  const { ui: { modal } } = state;
  return modal;
}

export const selectPopover = function (state) {
  const { ui: { popover } } = state;
  return popover;
}