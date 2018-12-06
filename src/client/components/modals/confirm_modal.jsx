import React from 'react';
import { connect } from 'react-redux';
import { deletePost } from '../../actions/post_actions';
import { deleteNote } from '../../actions/note_actions';
import { logout } from '../../actions/session_actions';

export const mapStateToProps = function (state, ownProps) {
  const { action, data, localAction } = ownProps;
  return {
    action,
    data,
    localAction,
  }
};

export const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    logout: () => dispatch(logout()),
    deletePost: (post) => dispatch(deletePost(post)),
    deleteNote: (note) => dispatch(deleteNote(note)),
  }
};

class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);

    const { logout, deletePost, deleteNote, localAction } = props;
    // 'registry' of actions that require confirmations
    this.modalActions = {
      'confirmLogout': logout,
      'confirmDeletePost': deletePost,
      'confirmDeleteComment': deleteNote, // comment is a type of note
      'confirmDiscardPostNew': localAction, // local modals will pass in local actions
      'confirmDiscardPostEdit': localAction, // local modals will pass in local actions
    };

    // the message to display on modal depending on action
    this.modalMessages = {
      'confirmLogout': 'log out',
      'confirmDeletePost': 'delete this post',
      'confirmDeleteComment': 'delete this comment',
      'confirmDiscardPostNew': 'discard this post',
      'confirmDiscardPostEdit': 'discard edits to this post',
    };

    this.handleClickOk = this.handleClickOk.bind(this);
    this.handleClickCancel = this.handleClickCancel.bind(this);
  }

  render() {
    const { action } = this.props;
    const message = this.modalMessages[action];

    return (
      <div className='confirm-modal'>
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
    e.stopPropagation(); // to prevent bubbling up to modal background which will closeModal
    this.modalActions[action](data);
  }

  handleClickCancel(e) {
    e.preventDefault();
    e.stopPropagation(); // to prevent bubbling up to close popover
    this.props.closeModal();
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);