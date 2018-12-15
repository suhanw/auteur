import React from 'react';
import { Link } from 'react-router-dom';
import { toggleClass } from '../../util/misc_util';

class NavbarMobileMenu extends React.Component {
  constructor(props) {
    super(props);

    this.greyBackgroundRef = React.createRef();
    this.mobileMenuRef = React.createRef();

    this.renderAccountSection = this.renderAccountSection.bind(this);
    this.renderBlogSection = this.renderBlogSection.bind(this);
  }

  render() {
    return (
      <div className='mobile-menu-container'
        ref={this.greyBackgroundRef}>
        <div className={`mobile-menu`}
          ref={this.mobileMenuRef}>
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

  componentDidUpdate(prevProps) {
    const { activeIcon } = this.props;
    if (!activeIcon) {
      this.greyBackgroundRef.current.classList.remove('background-greyout');
      this.mobileMenuRef.current.classList.remove('active');
    }
    else if (activeIcon === 'hamburger') {
      this.greyBackgroundRef.current.classList.add('background-greyout');
      this.mobileMenuRef.current.classList.add('active');
    }
  }

  renderAccountSection() {
    const { currentUser, confirmLogout, toggleHamburger } = this.props;
    let likeCount = '0';
    if (currentUser.likeCount) likeCount = currentUser.likeCount;
    return (
      <ul>
        <Link to={`/dashboard`}>
          <li className='mobile-menu-item'
            onClick={toggleHamburger}>
            <span><i className="fas fa-home"></i> Dashboard</span>
          </li>
        </Link>
        <Link to={`/dashboard/${currentUser._id}/likes`}>
          <li className='mobile-menu-item'
            onClick={toggleHamburger}>
            <span><i className="fas fa-heart"></i> Likes</span>
            <span className='mobile-item-suffix'>{likeCount}</span>
          </li>
        </Link>
        <Link to={`/dashboard/${currentUser._id}/following`}>
          <li className='mobile-menu-item'
            onClick={toggleHamburger}>
            <span><i className="fas fa-user-plus"></i> Following</span>
            <span className='mobile-item-suffix'>{currentUser.following.length}</span>
          </li>
        </Link>
        <Link to='/settings'>
          <li className='mobile-menu-item'
            onClick={toggleHamburger}>
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
    const { blog, toggleHamburger } = this.props;
    if (!blog) return null;
    return (
      <ul>
        <Link to={`/dashboard/blog/${blog._id}`}
          onClick={toggleHamburger}>
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