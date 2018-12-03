import React from 'react';
import { connect } from 'react-redux';

import ConfirmModal from './confirm_modal';
import PostModal from './post_modal'
import { closeModal } from '../../actions/modal_actions';
import { selectModal } from '../../selectors/selectors';


const mapStateToProps = function (state, ownProps) {
  const modal = selectModal(state);
  return {
    modal,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    closeModal: () => dispatch(closeModal()),
  };
};


class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.postModalRef = React.createRef(); // step 1: create ref
    this.handleKeydown = this.handleKeydown.bind(this);
  }


  render() {
    const { modal, closeModal } = this.props;
    let modalComponent;

    if (!modal) return null;

    const modalComponents = {
      'confirmLogout': <ConfirmModal
        action={modal.action}
        data={modal.data}
        closeModal={closeModal} />,
      'confirmDeletePost': <ConfirmModal
        action={modal.action}
        data={modal.data}
        closeModal={closeModal} />,
      'choosePostType': <PostModal
        action={modal.action}
        closeModal={closeModal} />
    };

    modalComponent = modalComponents[modal.action];

    return (
      <div className='modal-container background-greyout'
        ref={this.postModalRef /* step 2: attach ref to DOM node */}
        tabIndex={'0' /* step 3: need this attrib for focus() to work on DIVs */}
        onClick={closeModal}
        onKeyDown={this.handleKeydown} >
        {modalComponent}
      </div>
    );
  }

  componentDidUpdate(prevProps) { //executes after modal is displayed
    const { modal } = this.props;
    if (!modal) return;

    // step 4: ref.current stores the DOM node, and you can call DOM methods
    this.postModalRef.current.focus();
  }

  handleKeydown(e) {
    e.preventDefault();
    if (e.key === 'Escape') {
      this.props.closeModal();
    }
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);