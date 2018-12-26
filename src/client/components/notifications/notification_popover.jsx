import React from 'react';

import { GlobalContext } from '../global_ context_provider';
import { LikeNotification } from './notifications.jsx';

class NotificationPopover extends React.Component {
  constructor(props) {
    super(props);

    this.notifComponents = {
      'like': LikeNotification,
      // 'comment': CommentNotification,
      // 'follow': FollowNotification,
    };

    this.renderHeader = this.renderHeader.bind(this);
    this.renderNotifications = this.renderNotifications.bind(this);
    this.renderDateSubheader = this.renderDateSubheader.bind(this);
  }

  render() {

    return (
      <div className='notification-popover popover'>
        {this.renderHeader()}
        <div className='scrolling-container'>
          {this.renderNotifications()}
        </div>
      </div>
    );
  }

  renderHeader() {
    const { currentUser } = this.context;
    return (
      <header className='notification-popover-header'>
        <div className='avatar avatar-extra-small'
          style={{ backgroundImage: `url(${currentUser.avatarImageUrl})` }}></div>
        <h1>{currentUser.username}</h1>
      </header>
    );
  }

  renderNotifications() {

    return (
      <section className='popover-subsection'>
        {this.renderDateSubheader()}
      </section>
    );
  }

  renderNotification(notification) {
    const NotifComponent = this.notifComponents[notification.type];
    return (
      <NotifComponent notification={notification} />
    );
  }

  renderDateSubheader() {
    return (
      <header className='popover-header'>
        <span>TODAY</span>
        <span className='popover-item-suffix'>Wednesday, December 26</span>
      </header>
    );
  }
}

NotificationPopover.contextType = GlobalContext;

export default NotificationPopover;