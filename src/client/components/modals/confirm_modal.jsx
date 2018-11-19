import React from 'react';
import { connect } from 'react-redux';
import { deletePost } from '../../actions/post_actions';
import { logout } from '../../actions/session_actions';
import { closeModal } from '../../actions/modal_actions';

export const mapStateToProps = function (state, ownProps) {
  const { action, data } = ownProps;
  return {
    action,
    data,
  }
};

export const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    logout: () => dispatch(logout()),
    deletePost: (post) => dispatch(deletePost(post)),
    closeModal: () => dispatch(closeModal()),
  }
};

class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);

    const { logout, deletePost } = props;
    // 'registry' of actions that require confirmations
    this.modalActions = {
      'confirmLogout': logout,
      'confirmDeletePost': deletePost,
    };

    // the message to display on modal depending on action
    this.modalMessages = {
      'confirmLogout': 'log out',
      'confirmDeletePost': 'delete this post',
    };

    this.handleClickOk = this.handleClickOk.bind(this);
    this.handleClickCancel = this.handleClickCancel.bind(this);
  }

  render() {
    const { action } = this.props;
    const message = this.modalMessages[action];

    return (
      <div>
        <p className='confirm-modal-message'>Are you sure you want to {message}?</p>
        <div className='confirm-modal-options'>
          <button className='btn btn-default btn-grey' onClick={this.handleClickCancel}>Cancel</button>
          <button className='btn btn-default btn-blue' onClick={this.handleClickOk}>OK</button>
        </div>
      </div >
    );
  }

  handleClickOk(e) {
    const { action, data } = this.props;
    e.preventDefault();
    this.modalActions[action](data);
  }

  handleClickCancel(e) {
    e.preventDefault();
    this.props.closeModal();
  }

}


export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);