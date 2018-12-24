import React from 'react';
import { Link } from 'react-router-dom';

class AccountPopover extends React.Component {
  constructor(props) {
    super(props);

    this.renderAccountSection = this.renderAccountSection.bind(this);
    this.renderBlogSection = this.renderBlogSection.bind(this);
    this.renderBlogItem = this.renderBlogItem.bind(this);
  }

  render() {
    const { confirmLogout } = this.props;
    return (
      <div className='account-popover popover'>
        <section className='popover-subsection'>
          <header className='popover-header'>
            <span>Account</span>
            <span className='popover-item-suffix link' onClick={confirmLogout}>Log out</span>
          </header>

          {this.renderAccountSection()}

        </section>
        <section className='popover-subsection'>
          <header className='popover-header'>
            Blogs
          </header>

          {this.renderBlogSection()}

        </section>
      </ div>
    );
  }

  renderAccountSection() {
    const { currentUser } = this.props;
    let likeCount = '0';
    if (currentUser.likeCount) likeCount = currentUser.likeCount;
    return (
      <ul>
        <Link to={`/dashboard/${currentUser._id}/likes`}>
          <li className='popover-menu-item'>
            <span><i className="fas fa-heart"></i> Likes</span>
            <span className='popover-item-suffix'>{likeCount}</span>
          </li>
        </Link>
        <Link to={`/dashboard/${currentUser._id}/following`}>
          <li className='popover-menu-item'>
            <span><i className="fas fa-user-plus"></i> Following</span>
            <span className='popover-item-suffix'>{currentUser.following.length}</span>
          </li>
        </Link>
        <Link to='/settings'>
          <li className='popover-menu-item'>
            <span><i className="fas fa-user-cog"></i> Settings</span>
            {/* TODO: add a page to update user account */}
          </li>
        </Link>
      </ul>
    );
  }

  renderBlogSection() {
    const { blog } = this.props;
    if (!blog) return null;
    return (
      <ul>
        {this.renderBlogItem(blog)}
      </ul>
    );
  }

  renderBlogItem(blog) {
    return (
      <Link to={`/dashboard/blog/${blog._id}`}>
        <li className='popover-menu-item blog-item'>
          <div className='avatar avatar-small'
            style={{ backgroundImage: `url(${blog.avatarImageUrl})` }} />
          <div className='blog-item-details'>
            <span className='blog-item-details-name'>{blog.name}</span>
            <span className='blog-item-details-title'>{blog.title}</span>
          </div>
        </li>
      </Link>
    );
  }
}

export default AccountPopover;