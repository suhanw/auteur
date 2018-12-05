import React from 'react';
import { NavLink } from 'react-router-dom';
import { fetchUserLikes } from '../../actions/user_actions';

class Sidemenu extends React.Component {
  constructor(props) {
    super(props);
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

  componentDidMount() {
    const { fetchBlog, fetchUserLikes, currentUser } = this.props;
    fetchBlog(currentUser.primaryBlog);
    fetchUserLikes(currentUser._id);
  }
}

export default Sidemenu;