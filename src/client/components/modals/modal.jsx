import React from 'react';
import { connect } from 'react-redux';
import { merge } from 'lodash';

import ConfirmModal from './confirm_modal';
import PostModal from './post_modal'
import { closeModal } from '../../actions/modal_actions';
import { selectModal } from '../../selectors/selectors';


const mapStateToProps = function (state, ownProps) {
  let modal = selectModal(state);
  if (ownProps.localModal) modal = ownProps.localModal; // for modals that depend on 'local' React state
  return {
    modal,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  if (ownProps.localModal) return { closeModal: ownProps.closeModal }; // local modals will pass in local closeModal func
  return {
    closeModal: () => dispatch(closeModal())
  };
};


class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.modalComponents = {
      'confirmLogout': ConfirmModal,
      'confirmDeletePost': ConfirmModal,
      'confirmDeleteComment': ConfirmModal,
      'confirmDiscardPostNew': ConfirmModal,
      'confirmDiscardPostEdit': ConfirmModal,
      'choosePostType': PostModal,
    };

    this.modalContainerRef = React.createRef(); // step 1: create ref to focus on div and enable keydown
    this.handleKeydown = this.handleKeydown.bind(this);
  }


  render() {
    const { modal, closeModal } = this.props;

    if (!modal) return null;

    const ModalComponent = this.modalComponents[modal.action];

    return (
      <div className='modal-container background-greyout'
        style={{ zIndex: 8 }}
        ref={this.modalContainerRef /* step 2: attach ref to DOM node */}
        tabIndex={'0' /* step 3: need this attrib for focus() to work on DIVs */}
        onClick={closeModal}
        onKeyDown={this.handleKeydown} >
        <ModalComponent
          action={modal.action}
          data={modal.data}
          localAction={modal.localAction} // only for non-redux actions
          closeModal={closeModal} />
      </div>
    );
  }

  componentDidUpdate(prevProps) { //executes after modal is displayed
    const { modal } = this.props;
    if (!modal) return;

    // step 4: ref.current stores the DOM node, and you can call DOM methods
    this.modalContainerRef.current.focus();
  }

  handleKeydown(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Escape') {
      this.props.closeModal();
    }
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);