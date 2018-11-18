import React from 'react';
import { connect } from 'react-redux';

import ConfirmDeletePostModal from './confirm_delete_post_modal';
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

    switch (modal) {
      case 'confirmDeletePost':
        modalComponent = <ConfirmModal message='confirmDeletePost' />
        break;

      default:
        return null;
    }

    return (
      <div className='modal-container background-greyout'>
        {modalComponent}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Modal);