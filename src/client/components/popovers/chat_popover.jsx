import React from 'react';

class ChatPopover extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { popoverStyle } = this.props;
    return (
      <div className='chat-popover popover'
        style={popoverStyle}>
        <span className='popover-menu-item'>
          Working on it! Stay tuned!
        </span>
      </div>
    );
  }

}

export default ChatPopover;