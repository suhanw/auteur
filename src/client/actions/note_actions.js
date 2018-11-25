import * as APIUtil from '../util/note_api_util';

export const RECEIVE_NOTE = 'RECEIVE_NOTE';
export const RECEIVE_NOTE_ERRORS = 'RECEIVE_NOTE_ERRORS';

export const receiveNote = function (note) {
  return {
    type: 'RECEIVE_NOTE',
    payload: note,
  };
};

export const receiveNoteErrors = function (errors) {
  return {
    type: RECEIVE_NOTE_ERRORS,
    payload: errors,
  };
};

export const createNote = function (note) {
  return function (dispatch) {
    return APIUtil.createNote(note).then(
      (note) => {
        // FIX: need to dispatch fetchPost
        dispatch(receiveNote(note))
      },
      (err) => dispatch(receiveNoteErrors(err.responseJSON))
    );
  };
};