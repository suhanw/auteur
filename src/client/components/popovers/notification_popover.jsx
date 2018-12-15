import React from 'react';

class NotificationPopover extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='notification-popover popover'>
        <span className='popover-menu-item'>
          Working on it! Stay tuned!
        </span>
      </div>
    );
  }

}

export default NotificationPopover;