import React from 'react';

import { GlobalContext } from '../global_ context_provider';
import { LikeNotification, CommentNotification } from './notifications.jsx';

class NotificationPopover extends React.Component {
  constructor(props) {
    super(props);

    this.notifComponents = {
      'like': LikeNotification,
      'comment': CommentNotification,
      // 'follow': FollowNotification,
    };

    this.renderHeader = this.renderHeader.bind(this);
    this.renderNotifications = this.renderNotifications.bind(this);
    this.renderNotification = this.renderNotification.bind(this);
    this.renderDateSubheader = this.renderDateSubheader.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
  }

  render() {

    return (
      <div className='notification-popover popover'>
        {this.renderHeader()}
        {this.renderEmpty()}
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
    // TESTING
    let notification = {
      type: 'comment', // this is either like, comment, or follow
    };
    // TESTING

    return (
      <section className='popover-subsection'>
        {this.renderDateSubheader()}
        <ul>
          {this.renderNotification(notification)}
          {this.renderNotification(notification)}
        </ul>
      </section>
    );
  }

  renderNotification(notification) {
    // TESTING
    let author = {
      username: 'ian',
      avatarImageUrl: "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/syfywire_blog_post/2018/09/jurassicParkJeffGoldblumShirtless.jpg?itok=Ktt3LJrf&timestamp=1536081511",
    };
    let notifiable = {
      type: 'comment',
      body: 'Adipisicing nostrud occaecat deserunt eiusmod ut sint dolore mollit excepteur veniam dolor esse reprehenderit non. Elit est id veniam reprehenderit aliqua ut duis anim commodo dolor. Exercitation nisi consequat sint nulla tempor.',
    };
    let entity = { // this is post, or blog
      type: 'text',
      title: 'lorem'
    };
    // TESTING

    const NotifComponent = this.notifComponents[notification.type];
    return (
      <NotifComponent
        author={author}
        notifiable={notifiable}
        entity={entity} />
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

  renderEmpty() {
    return (
      <section className='notification-empty'>
        <i className='fas fa-bell' />
        <div>
          Check out this tab when you make a post to see likes, comments, and new followers.
        </div>
      </section>
    );
  }
}

NotificationPopover.contextType = GlobalContext;

export default NotificationPopover;