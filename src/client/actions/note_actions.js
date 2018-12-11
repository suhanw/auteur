import * as APIUtil from '../util/api_util/note_api_util';
import { fetchPost } from '../actions/post_actions';
import { fetchUserLikes } from '../actions/user_actions';

export const RECEIVE_NOTE = 'RECEIVE_NOTE';
export const RECEIVE_NOTES = 'RECEIVE_NOTES';
export const REMOVE_NOTE = 'REMOVE_NOTE';
export const RECEIVE_NOTE_ERRORS = 'RECEIVE_NOTE_ERRORS';
export const CONFIRM_DELETE_COMMENT = 'CONFIRM_DELETE_COMMENT';

export const receiveNote = function (note) {
  return {
    type: RECEIVE_NOTE,
    payload: note,
  };
};

export const removeNote = function (note) {
  return {
    type: REMOVE_NOTE,
    payload: note,
  };
};

export const receiveNotes = function (notes) {
  return {
    type: RECEIVE_NOTES,
    payload: notes,
  };
};

export const receiveNoteErrors = function (errors) {
  return {
    type: RECEIVE_NOTE_ERRORS,
    payload: errors,
  };
};

export const confirmDeleteComment = function (comment) {
  return {
    type: CONFIRM_DELETE_COMMENT,
    payload: {
      action: 'confirmDeleteComment',
      data: comment,
    },
  };
};

export const fetchNotes = function (postId) {
  return function (dispatch) {
    return APIUtil.fetchNotes(postId).then(
      (notes) => dispatch(receiveNotes(notes)),
      (err) => dispatch(receiveNoteErrors(err.responseJSON))
    );
  };
};

export const createNote = function (note) {
  return function (dispatch) {
    return APIUtil.createNote(note).then(
      (note) => {
        dispatch(receiveNote(note));
        if (note.type === 'like') dispatch(fetchUserLikes(note.author));
      },
      (err) => dispatch(receiveNoteErrors(err.responseJSON))
    );
  };
};

export const deleteNote = function (note) {
  return function (dispatch) {
    return APIUtil.deleteNote(note).then(
      (note) => {
        dispatch(removeNote(note));
        if (note.type === 'like') dispatch(fetchUserLikes(note.author));
      },
      (err) => dispatch(receiveNoteErrors(err.responseJSON))
    );
  };
};

