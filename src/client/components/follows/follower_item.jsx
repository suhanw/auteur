import React from 'react';

import { showPopover, hidePopover, renderFollowPopover } from './follow_popover_util';

class FollowerItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      followPopover: false,
    };
  }

  render() {
    const { follower, followerPrimaryBlog } = this.props;

    return (
      <li key={follower._id} className='follower-info'>
        <img src={follower.avatarImageUrl} className='avatar avatar-small' />
        <div className='follower-details'>
          <span className='follower-details-name'
            onMouseOver={showPopover(this, 'followPopover')}
            onMouseOut={hidePopover(this, true, 'followPopover')}>
            {follower.username}
            {renderFollowPopover(this, followerPrimaryBlog._id, 'followPopover')}
          </span>
          <span className='follower-details-title'>{followerPrimaryBlog.title}</span>
        </div>
        {this.renderFollowButton(followerPrimaryBlog._id)}
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

  handleClick(blogId) {
    const { createFollow } = this.props;
    return function (e) {
      e.preventDefault();
      createFollow(blogId);
    };
  }
}

export default FollowerItem;