import { connect } from 'react-redux';
import NoteMenu from './note_menu';

import { confirmDeletePost } from '../../actions/post_actions';
import { openPopover, closePopover } from '../../actions/popover_actions';
import { createNote, checkUserLikePost } from '../../actions/note_actions';
import { selectCurrentUser, selectPopover } from '../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  const currentUser = selectCurrentUser(state);
  const { post } = ownProps;
  const popover = selectPopover(state);
  return {
    currentUser,
    post,
    popover,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    confirmDeletePost: (post) => dispatch(confirmDeletePost(post)),
    closePopover: () => dispatch(closePopover()),
    openPopover: (popover) => dispatch(openPopover(popover)),
    createNote: (note) => dispatch(createNote(note)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteMenu);