import React from 'react';
import { Link } from 'react-router-dom';

class NavbarMobileMenu extends React.Component {
  constructor(props) {
    super(props);

    this.renderAccountSection = this.renderAccountSection.bind(this);
    this.renderBlogSection = this.renderBlogSection.bind(this);
  }

  render() {
    const { confirmLogout } = this.props;
    return (
      <div className='background-greyout'>
        <div className='mobile-menu'>
          <section className='mobile-menu-subsection'>
            {this.renderAccountSection()}
          </section>
          <section className='mobile-menu-subsection'>
            <header className='mobile-menu-header'>
              Blogs
          </header>

            {this.renderBlogSection()}

          </section>
        </ div>
      </div>
    );
  }

  renderAccountSection() {
    const { currentUser, confirmLogout } = this.props;
    let likeCount = '0';
    if (currentUser.likeCount) likeCount = currentUser.likeCount;
    return (
      <ul>
        <Link to={`/dashboard`}>
          <li className='mobile-menu-item'>
            <span><i className="fas fa-home"></i> Dashboard</span>
          </li>
        </Link>
        <Link to={`/dashboard/${currentUser._id}/likes`}>
          <li className='mobile-menu-item'>
            <span><i className="fas fa-heart"></i> Likes</span>
            <span className='mobile-item-suffix'>{likeCount}</span>
          </li>
        </Link>
        <Link to={`/dashboard/${currentUser._id}/following`}>
          <li className='mobile-menu-item'>
            <span><i className="fas fa-user-plus"></i> Following</span>
            <span className='mobile-item-suffix'>{currentUser.following.length}</span>
          </li>
        </Link>
        <Link to='/settings'>
          <li className='mobile-menu-item'>
            <span><i className="fas fa-user-cog"></i> Settings</span>
          </li>
        </Link>
        <li className='mobile-menu-item'
          onClick={confirmLogout}>
          <span><i className="fas fa-sign-out-alt"></i> Log out</span>
        </li>
      </ul>
    );
  }

  renderBlogSection() {
    const { blog } = this.props;
    if (!blog) return null;
    return (
      <ul>
        <Link to={`/dashboard/blog/${blog._id}`}>
          <li className='mobile-menu-item blog'>
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
        </Link>
      </ul>
    );
  }
}

export default NavbarMobileMenu;