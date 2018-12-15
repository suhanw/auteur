import React from 'react';

class ChatPopover extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='chat-popover popover'>
        <span className='popover-menu-item'>
          Working on it! Stay tuned!
        </span>
      </div>
    );
  }

}

export default ChatPopover;