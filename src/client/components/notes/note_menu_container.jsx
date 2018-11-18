import { connect } from 'react-redux';
import NoteMenu from './note_menu';

import { deletePost, confirmDeletePost } from '../../actions/post_actions';
import { selectCurrentUser } from '../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  const currentUser = selectCurrentUser(state);
  const { post } = ownProps;
  return {
    currentUser,
    post,
  }
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    deletePost: (post) => dispatch(deletePost(post)),
    confirmDeletePost: (post) => dispatch(confirmDeletePost(post)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteMenu);