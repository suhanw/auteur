import React from 'react';

class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { message, handleClickOk, handleClickCancel } = this.props;
    return (
      <div className='modal-container background-greyout'>
        <div className='confirm-modal'>
          <p className='confirm-modal-message'>Are you sure you want to {message}?</p>
          <div className='confirm-modal-options'>
            <button className='btn btn-default btn-grey' onClick={handleClickCancel}>Cancel</button>
            <button className='btn btn-default btn-blue' onClick={handleClickOk}>OK</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmModal;