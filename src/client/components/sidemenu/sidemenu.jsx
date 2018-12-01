import React from 'react';
import { NavLink } from 'react-router-dom';

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
      <aside>
        <header className='sidemenu-header'>
          <h1>{blog.name}</h1>
          <h2>{blog.title}</h2>
        </header>
        <NavLink to={`/dashboard/blog/${blog._id}`} className='sidemenu-link'>
          <span className='sidemenu-item'>Posts</span>
          <span className='sidemenu-count'>{blog.postCount}</span>
        </NavLink>
        <NavLink to='/dashboard/followers' className='sidemenu-link'>
          <span className='sidemenu-item'>Followers</span>
          <span className='sidemenu-count'>{blog.followerCount}</span>
        </NavLink>
        <NavLink to='/dashboard/likes' className='sidemenu-link'>
          <span className='sidemenu-item'>Likes</span>
          <span className='sidemenu-count'>{currentUser.likeCount}</span>
        </NavLink>
        <NavLink to='/dashboard/following' className='sidemenu-link'>
          <span className='sidemenu-item'>Following</span>
          <span className='sidemenu-count'>{currentUser.following.length}</span>
        </NavLink>
        <NavLink to={`/settings/blog/${blog._id}`} className='sidemenu-link'>
          <span className='sidemenu-item'>Edit Appearance</span>
          <span className='sidemenu-count'><i className="fas fa-angle-right"></i></span>
        </NavLink>
      </aside>
    );
  }

  componentDidMount() {
    const { fetchBlog, currentUser } = this.props;
    fetchBlog(currentUser.primaryBlog);
  }
}

export default Sidemenu