import React from 'react';

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
        <div className='sidemenu-link'>
          <span className='sidemenu-item'>Posts</span>
          <span className='sidemenu-count'>{blog.postCount}</span>
        </div>
        <div className='sidemenu-link'>
          <span className='sidemenu-item'>Followers</span>
          <span className='sidemenu-count'>{blog.followerCount}</span>
        </div>
        <div className='sidemenu-link'>
          <span className='sidemenu-item'>Following</span>
          <span className='sidemenu-count'>{currentUser.following.length}</span>
        </div>
        <div className='sidemenu-link'>
          <span className='sidemenu-item'>Drafts</span>
          <span className='sidemenu-count'>tbd</span>
        </div>
        <div className='sidemenu-link'>
          <span className='sidemenu-item'>Edit Appearance</span>
          <span className='sidemenu-count'>tbd</span>
        </div>
      </aside>
    );
  }

  componentDidMount() {
    const { fetchBlog, currentUser } = this.props;
    fetchBlog(currentUser.primaryBlog);
  }
}

export default Sidemenu