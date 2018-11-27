export const createNote = function (note) {
  return $.ajax({
    method: 'POST',
    url: `/api/posts/${note.post}/notes`,
    data: note,
  });
};

export const deleteNote = function (note) {
  return $.ajax({
    method: 'DELETE',
    url: `/api/posts/${note.post}/notes/${note._id}`,
    data: note,
  });
};

export const fetchNotes = function (postId) {
  return $.ajax({
    method: 'GET',
    url: `/api/posts/${postId}/notes/`,
  });
};

// export const checkUserLikePost = function (postId, userId) {
//   let queryString = `?userId=${userId}`;
//   return $.ajax({
//     method: 'GET',
//     url: `/api/posts/${postId}/notes/${queryString}`,
//   });
// };