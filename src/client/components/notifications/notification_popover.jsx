import React from 'react';
import { connect } from 'react-redux';

import { GlobalContext } from '../global_ context_provider';
import { LikeNotification, CommentNotification } from './notifications.jsx';
import { selectNotifications } from '../../selectors/selectors';
import { fetchNotifications } from '../../actions/notification_actions';

const mapStateToProps = (state, _) => {
  return {
    notifications: selectNotifications(state),
  };
};

const mapDispatchToProps = (dispatch, _) => {
  return {
    fetchNotifications: () => dispatch(fetchNotifications()),
  };
};

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

  componentDidMount() {
    this.props.fetchNotifications();
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
    const { notifications } = this.props;
    if (!notifications.allIds.length) return null;
    let notificationElements = [];
    for (let i = 0; i < notifications.allIds.length; i++) {
      let notifId = notifications.allIds[i];
      let prevNotifId = notifications.allIds[i - 1];
      let notification = notifications.byId[notifId];
      let currDate = (new Date(notification.createdAt)).toDateString();
      let prevDate = (i !== 0) ? (new Date(notifications.byId[prevNotifId].createdAt)).toDateString() : null;
      if (currDate !== prevDate) notificationElements.push(this.renderDateSubheader(notification.createdAt));
      notificationElements.push(this.renderNotification(notification));
    }
    return (
      <section className='popover-subsection'>
        <ul>
          {notificationElements}
        </ul>
      </section>
    );
  }

  renderNotification(notification) {
    const NotifComponent = this.notifComponents[notification.type];
    return (
      <NotifComponent key={notification._id}
        notifiable={notification.notifiable}
      />
    );
  }

  renderDateSubheader(UTCdate) {
    let date = new Date(UTCdate);
    let dateString = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    let today = new Date();
    let daysAgo = null;
    if (today.toDateString() === date.toDateString()) {
      daysAgo = 'TODAY';
    }
    return (
      <header className='popover-header' key={dateString}>
        <span>{daysAgo}</span>
        <span className='popover-item-suffix'>{dateString}</span>
      </header>
    );
  }

  renderEmpty() {
    const { notifications } = this.props;
    if (notifications.allIds.length) return null; // only render when there are no notifs
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationPopover);