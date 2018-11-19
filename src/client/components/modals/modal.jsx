import React from 'react';
import { connect } from 'react-redux';

import ConfirmModal from './confirm_modal';
import { selectModal } from '../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  const modal = selectModal(state);
  return {
    modal,
  }
};


class Modal extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { modal } = this.props;
    let modalComponent;

    if (!modal) return null;

    switch (modal.action) {
      case 'confirmLogout':
        modalComponent = <ConfirmModal action={modal.action} data={modal.data} />
        break;
      case 'confirmDeletePost':
        modalComponent = <ConfirmModal action={modal.action} data={modal.data} />
        break;
      default:
        return null;
    }

    return (
      <div className='modal-container background-greyout'>
        <div className='confirm-modal'>
          {modalComponent}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Modal);