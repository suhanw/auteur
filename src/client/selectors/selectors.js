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

export const selectPosts = function (state, view, blogId = null) { // optional blogId argument
  const { entities: { posts, blogs } } = state;
  const { ui: { postIndex } } = state;
  let postIdsArr = [];

  if (view === 'blogId') {
    // debugger
    const blog = blogs.byId[blogId];
    postIdsArr = (!blog || !blog.posts) ? [] : blog.posts;  // in case no blogs fetched in state yet
  } else {
    postIdsArr = postIndex[view];
  }

  let postsArr = postIdsArr.map(function (postId) {
    return posts.byId[postId];
  });
  return postsArr;
};


export const selectPost = function (state, postId) {
  const { entities: { posts: { byId } } } = state;
  let post = byId[postId];
  return post;
}

export const selectNotes = function (state, postId) {
  const { entities: { notes } } = state; // pull the notes slice of state
  const post = selectPost(state, postId); // pull the current post
  if (!post.notes) return null; // when notes are being fetched, post.notes will be undefined
  let notesArr = post.notes.map(function (noteId) { //iterate through the notes array in the current post object
    return notes.byId[noteId];
  });
  return notesArr;
};

export const selectUsers = function (state) {
  const { entities: { users } } = state;
  let usersObj = users.byId;
  return usersObj;
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

export const selectModal = function (state) {
  const { ui: { modal } } = state;
  return modal;
}

export const selectPopover = function (state) {
  const { ui: { popover } } = state;
  return popover;
}

export const selectLoadingPostSubmit = function (state) {
  const { ui: { loading: { loadingPostSubmit } } } = state;
  return loadingPostSubmit;
}

export const selectLoadingPostIndex = function (state) {
  const { ui: { loading: { loadingPostIndex } } } = state;
  return loadingPostIndex;
}