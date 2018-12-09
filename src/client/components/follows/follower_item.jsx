import React from 'react';

import { showPopover, hidePopover, renderFollowPopover } from './follow_popover_util';

class FollowerItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      followPopover: false,
    };

    this.renderFollowButton = this.renderFollowButton.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { follower, followerPrimaryBlog } = this.props;

    return (
      <li key={follower._id} className='follower-info'>
        <div className='avatar avatar-small'
          style={{ backgroundImage: `url(${follower.avatarImageUrl})` }}
          onMouseEnter={showPopover(this, 'followPopover')}
          onMouseLeave={hidePopover(this, 'followPopover')}
          onClick={this.toggleDrawer} />
        <div className='follower-details'>
          <span className='follower-details-name'
            onMouseEnter={showPopover(this, 'followPopover')}
            onMouseLeave={hidePopover(this, 'followPopover')}
            onClick={this.toggleDrawer}>
            {follower.username}
          </span>
          <span className='follower-details-title'>{followerPrimaryBlog.title}</span>
        </div>
        {this.renderFollowButton(followerPrimaryBlog._id)}
        {renderFollowPopover(this, followerPrimaryBlog._id, 'followPopover')}
      </li>
    );
  }

  renderFollowButton(followerPrimaryBlogId) {
    const { currentUser } = this.props;

    if (currentUser.following.includes(followerPrimaryBlogId)) return null;
    return (
      <button className='btn btn-default btn-blue' onClick={this.handleClick(followerPrimaryBlogId)}>
        Follow
      </button>
    );
  }

  toggleDrawer(e) {
    e.preventDefault();
    const { openDrawer, followerPrimaryBlog } = this.props;
    let blogDrawer = {
      view: 'blog',
      data: followerPrimaryBlog,
    };
    openDrawer(blogDrawer);
  }

  handleClick(blogId) {
    const { createFollow } = this.props;
    return function (e) {
      e.preventDefault();
      createFollow(blogId);
    };
  }
}

export default FollowerItem;