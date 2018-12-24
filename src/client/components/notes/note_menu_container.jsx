import { connect } from 'react-redux';
import NoteMenu from './note_menu';

import { confirmDeletePost } from '../../actions/post_actions';
import { openPopover, closePopover } from '../../actions/popover_actions';
import { openChatDrawer } from '../../actions/chat_actions';
import { createNote, deleteNote } from '../../actions/note_actions';
import { selectPopover } from '../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  const { blog, post, view } = ownProps;
  const popover = selectPopover(state);
  return {
    blog,
    post,
    popover,
    view,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    confirmDeletePost: (post) => dispatch(confirmDeletePost(post)),
    closePopover: () => dispatch(closePopover()),
    openPopover: (popover) => dispatch(openPopover(popover)),
    createNote: (note) => dispatch(createNote(note)),
    deleteNote: (note) => dispatch(deleteNote(note)),
    openChatDrawer: (chatDrawer) => dispatch(openChatDrawer(chatDrawer)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteMenu);