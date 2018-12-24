// SESSION SELECTORS=================================
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

// ENTITIES SELECTORS=================================
export const selectPosts = function (state, view, blogId = null) { // optional blogId argument
  const { entities: { posts } } = state;
  let postIdsArr = [];
  let postsArr = [];

  if (view === 'currentBlog' || view === 'blogDrawer') { // get the array of postIds from the blog slice of state
    const blog = selectBlog(state, blogId);
    postIdsArr = (!blog || !blog.posts) ? [] : blog.posts;  // in case no blogs fetched in state yet
  } else { // otherwise, array of postIds in postIndex slice of state
    const { ui: { postIndex } } = state;
    postIdsArr = postIndex[view];
  }

  postIdsArr.forEach(function (postId) {
    // the post may not have been fetched yet, push into array only when already in state
    if (posts.byId[postId]) postsArr.push(posts.byId[postId]);
  });

  return postsArr;
};


export const selectPost = function (state, postId) {
  const { entities: { posts: { byId } } } = state;
  let post = byId[postId];
  return post;
};

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
};

export const selectTags = function (state) {
  const { entities: { tags } } = state;
  return tags;
}

export const selectChatRooms = function (state) {
  const { entities: { chatRooms } } = state;
  return chatRooms;
}

export const selectChatMessages = function (state) {
  const { entities: { chatMessages } } = state;
  return chatMessages;
}

// UI SELECTORS=================================
export const selectModal = function (state) {
  const { ui: { modal } } = state;
  return modal;
};

export const selectPopover = function (state) {
  const { ui: { popover } } = state;
  return popover;
};

export const selectDrawer = function (state) {
  const { ui: { drawer } } = state;
  return drawer;
};

export const selectChatDrawers = function (state) {
  const { ui: { chatDrawers } } = state;
  return chatDrawers;
}

export const selectLoadingPostSubmit = function (state) {
  const { ui: { loading: { loadingPostSubmit } } } = state;
  return loadingPostSubmit;
};

export const selectLoadingPostIndex = function (state) {
  const { ui: { loading: { loadingPostIndex } } } = state;
  return loadingPostIndex;
};

export const selectLoadingSearchPosts = function (state) {
  const { ui: { loading: { loadingSearchPosts } } } = state;
  return loadingSearchPosts;
}

export const selectNavbar = function (state) {
  const { ui: { navbar } } = state;
  return navbar;
}

export const selectSearchUsers = function (state) {
  const { ui: { search: { users } } } = state;
  return users;
};

// ERROR SELECTORS=================================
export const selectPostErrors = function (state) {
  const { errors: { postErrors } } = state;
  return postErrors;
}