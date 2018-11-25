export const createNote = function (note) {
  return $.ajax({
    url: `/api/posts/${note.post}/notes`,
    method: 'POST',
    data: note,
  });
};