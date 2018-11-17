import { connect } from 'react-redux';
import NoteMenu from './note_menu';

import { deletePost } from '../../actions/post_actions';
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
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteMenu);