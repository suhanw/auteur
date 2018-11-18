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

export const selectBlogs = function (state) {
  const { entities: { blogs } } = state;
  const blogsObj = blogs.byId;
  return blogsObj;
};

export const selectBlog = function (state, blogId) {
  const blog = selectBlogs(state)[blogId];
  return blog;
}

export const selectConfirmModals = function (state) {
  const { ui: { modals: { confirmLogout, confirmDeletePost } } } = state;
  const confirmModals = {
    confirmLogout,
    confirmDeletePost,
  };
  return confirmModals;
}