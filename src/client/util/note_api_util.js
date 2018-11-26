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