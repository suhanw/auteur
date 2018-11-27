import React from 'react';

class AccountPopover extends React.Component {
  constructor(props) {
    super(props);

    this.renderAccountSection = this.renderAccountSection.bind(this);
    this.renderBlogSection = this.renderBlogSection.bind(this);
  }

  render() {
    const { popoverStyle, confirmLogout } = this.props;
    return (
      <div className='account-popover popover' style={popoverStyle}>
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
      </div>
    );
  }

  renderAccountSection() {
    const { currentUser } = this.props;
    let likeCount = '0';
    if (currentUser.likeCount) likeCount = currentUser.likeCount;
    return (
      <ul>
        <li className='popover-menu-item'>
          <span><i className="fas fa-heart"></i> Likes</span>
          <span className='popover-item-suffix'>{likeCount}</span>
          {/* FIX: update with Notes (likes) feature */}
        </li>
        <li className='popover-menu-item'>
          <span><i className="fas fa-user-plus"></i> Following</span>
          <span className='popover-item-suffix'>{currentUser.following.length}</span>
        </li>
        <li className='popover-menu-item'>
          <span><i className="fas fa-user-cog"></i> Settings</span>
          {/* FIX: add a page to update user account */}
        </li>
      </ul>
    );
  }

  renderBlogSection() {
    const { blog } = this.props;
    if (!blog) return null;
    return (
      <ul>
        <li className='popover-menu-item'>
          <div className='blog-item'>
            {/* FIX: link to blog show page */}
            <div className='blog-item-info'>
              <img src={blog.avatarImageUrl} className='avatar avatar-small' />
              <div className='blog-item-details'>
                <span className='blog-item-details-name'>{blog.name}</span>
                <span className='blog-item-details-title'>{blog.title}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    );
  }
}

export default AccountPopover;