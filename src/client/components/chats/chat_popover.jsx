import React from 'react';
import { connect } from 'react-redux';

import { GlobalContext } from '../global_ context_provider';
import { selectBlogs } from '../../selectors/selectors';
import { fetchUserFollowing } from '../../actions/user_actions';

const mapStateToProps = (state, _) => {
  const blogs = selectBlogs(state);
  return {
    blogs,
  };
};

const mapDispatchToProps = (dispatch, _) => {
  return {
    fetchUserFollowing: (userId, queryParams) => dispatch(fetchUserFollowing(userId, queryParams)),
  }
};

class ChatPopover extends React.Component {
  constructor(props) {
    super(props);

    this.renderHeader = this.renderHeader.bind(this);
    this.renderRecentlyFollowed = this.renderRecentlyFollowed.bind(this);
  }

  render() {
    return (
      <div className='chat-popover popover'>
        {this.renderHeader()}
        {this.renderRecentlyFollowed()}
      </div>
    );
  }

  componentDidMount() {
    const { currentUser } = this.context;
    const { fetchUserFollowing } = this.props;
    fetchUserFollowing(currentUser._id, { entity: 'blogs' });
  }

  renderHeader() {
    const { currentUser } = this.context;

    return (
      <section className='chat-popover-header'>
        {/* TODO: create Avatar component */}
        <div className='avatar avatar-extra-small'
          style={{ backgroundImage: `url(${currentUser.avatarImageUrl})` }}></div>
        <h1>
          {currentUser.username}
        </h1>
        <a>
          New Message
        </a>
      </section>
    )
  }

  renderRecentlyFollowed() {
    let followedBlogs = <li className='popover-menu-item'>Blog</li>;
    return (
      <section className='popover-subsection'>
        <header className='popover-header'>
          <span>Recently Followed</span>
        </header>
        <ul>
          {followedBlogs}
        </ul>
      </section>
    );
  }

}

ChatPopover.contextType = GlobalContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatPopover);