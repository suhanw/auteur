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
    this.renderRecentlyFollowedSection = this.renderRecentlyFollowedSection.bind(this);
    this.renderBlogItem = this.renderBlogItem.bind(this);
  }

  render() {
    return (
      <div className='chat-popover popover'>
        {this.renderHeader()}
        <div className='scrolling-container'>
          {this.renderRecentlyFollowedSection()}
        </div>
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

  renderRecentlyFollowedSection() {
    const { currentUser } = this.context;
    const { blogs } = this.props;
    let recentlyFollowed = currentUser.following.slice(-5).reverse();
    if (!recentlyFollowed || !recentlyFollowed.length) return null; // when user has not followed any blogs
    let followedBlogs = recentlyFollowed.map((blogId) => {
      const blog = blogs[blogId];
      return this.renderBlogItem(blog);
    });
    return (
      <section className='popover-subsection' >
        <header className='popover-header'>
          <span>Recently Followed</span>
        </header>
        <ul>
          {followedBlogs}
        </ul>
      </section>
    );
  }

  renderBlogItem(blog) {
    if (!blog) return null; // account for when blogs are not yet fetched
    return (
      <li key={blog._id}
        className='popover-menu-item'>
        <div className='blog-item'>
          <div className='blog-item-info'>
            <div className='avatar avatar-small'
              style={{ backgroundImage: `url(${blog.avatarImageUrl})` }} />
            <div className='blog-item-details'>
              <span className='blog-item-details-name'>{blog.name}</span>
              <span className='blog-item-details-title'>{blog.title}</span>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

ChatPopover.contextType = GlobalContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatPopover);