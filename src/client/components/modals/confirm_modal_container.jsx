import React from 'react';
import { connect } from 'react-redux';
import ConfirmModal from './confirm_modal';
import { deletePost } from '../../actions/post_actions';
import { logout } from '../../actions/session_actions';
import { closeModal } from '../../actions/modal_actions';
import { selectConfirmModals } from '../../selectors/selectors';

export const mapStateToProps = function (state, ownProps) {
  const confirmModals = selectConfirmModals(state);
  return {
    confirmModals,
  }
};

export const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    logout: () => dispatch(logout()),
    deletePost: (post) => dispatch(deletePost(post)),
    closeModal: () => dispatch(closeModal()),
  }
};

class ConfirmModalContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { confirmModals, logout, deletePost, closeModal } = this.props;
    let message;
    let handleClickOk;
    if (confirmModals.confirmLogout) {
      message = 'log out';
      handleClickOk = logout;
      // FIX: attach the modal to logout
    } else if (confirmModals.confirmDeletePost) {
      message = 'delete this post';
      handleClickOk = function () {
        deletePost(confirmModals.confirmDeletePost);
      }
    } else { // if no modals are activated, render nothing
      return null;
    }
    return (
      <ConfirmModal
        message={message}
        handleClickOk={handleClickOk}
        handleClickCancel={closeModal} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModalContainer);