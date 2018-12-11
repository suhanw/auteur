import React from 'react';
import { NavLink } from 'react-router-dom';
import { fetchUserLikes } from '../../actions/user_actions';

class Sidemenu extends React.Component {
  constructor(props) {
    super(props);

    this.renderConnect = this.renderConnect.bind(this);
  }

  render() {
    const { blog, currentUser } = this.props;
    if (!blog) {
      return null;
    }

    return (
      <aside className='sidemenu'>
        <header className='sidemenu-header'>
          <h1>{blog.name}</h1>
          <h2>{blog.title}</h2>
        </header>
        <NavLink to={`/dashboard/blog/${blog._id}`} className='sidemenu-link'>
          <span className='sidemenu-item'>Posts</span>
          <span className='sidemenu-count'>{blog.postCount}</span>
        </NavLink>
        <NavLink to={`/dashboard/${blog._id}/followers`} className='sidemenu-link'>
          <span className='sidemenu-item'>Followers</span>
          <span className='sidemenu-count'>{blog.followerCount}</span>
        </NavLink>
        {this.renderLikes()}
        {this.renderFollowing()}
        <NavLink to={`/settings/blog/${blog._id}`} className='sidemenu-link'>
          <span className='sidemenu-item'>Edit Appearance</span>
          <span className='sidemenu-count'><i className="fas fa-angle-right"></i></span>
        </NavLink>

        {this.renderConnect()}
      </aside>
    );
  }

  renderLikes() {
    const { currentUser } = this.props;
    if (currentUser.likeCount <= 0) return null;
    return (
      <NavLink to={`/dashboard/${currentUser._id}/likes`} className='sidemenu-link'>
        <span className='sidemenu-item'>Likes</span>
        <span className='sidemenu-count'>{currentUser.likeCount}</span>
      </NavLink>
    );
  }

  renderFollowing() {
    const { currentUser } = this.props;
    if (currentUser.following.length <= 0) return null;
    return (
      <NavLink to={`/dashboard/${currentUser._id}/following`} className='sidemenu-link'>
        <span className='sidemenu-item'>Following</span>
        <span className='sidemenu-count'>{currentUser.following.length}</span>
      </NavLink>
    );
  }

  renderConnect() {

    return (
      <section className='connect'>
        <h1 className='connect-header'>LET'S CONNECT</h1>
        <a className='connect-item'
          href='https://www.linkedin.com/in/suhanwijaya/'
          target='_blank'>
          <i className="fab fa-linkedin"></i>
          <div className='connect-info'>
            <strong>LinkedIn</strong>
            <span>linkedin.com/in/suhanwijaya</span>
          </div>
          <i className="fas fa-plus-square"></i>
        </a>
        <a className='connect-item'
          href='https://github.com/suhanw'
          target='_blank'>
          <i className="fab fa-github-square"></i>
          <div className='connect-info'>
            <strong>GitHub</strong>
            <span>github.com/suhanw</span>
          </div>
          <i className="fas fa-plus-square"></i>
        </a>
        <a className='connect-item'
          href='mailto:suhanw@gmail.com'
          target='_blank'>
          <i className="fas fa-envelope-square"></i>
          <div className='connect-info'>
            <strong>Email</strong>
            <span>suhanw@gmail.com</span>
          </div>
          <i className="fas fa-plus-square"></i>
        </a>
        <a className='connect-item'
          href='https://www.suhanwijaya.com/assets/suhan_wijaya_resume.pdf'
          target='_blank'>
          <i className="fas fa-file-download"></i>
          <div className='connect-info'>
            <strong>Resume</strong>
            <span>download</span>
          </div>
          <i className="fas fa-plus-square"></i>
        </a>
      </section>
    );
  }

  componentDidMount() {
    const { fetchBlog, fetchUserLikes, currentUser } = this.props;
    fetchBlog(currentUser.primaryBlog);
    fetchUserLikes(currentUser._id);
  }
}

export default Sidemenu;