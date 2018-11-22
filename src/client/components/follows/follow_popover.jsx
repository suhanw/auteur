import React from 'react';
import { connect } from 'react-redux';

import { fetchBlog } from '../../actions/blog_actions';
import { selectBlog } from '../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  const { blogId } = ownProps;
  const blog = selectBlog(state, blogId);
  // FIX: select top 3 posts with most notes
  return {
    blog,
  }
};

const mapDispatchToProps = function (dispatch, ownProps) {
  const { blogId } = ownProps;
  return {
    fetchBlog: () => dispatch(fetchBlog(blogId)),
  };
};

class FollowPopover extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { blog } = this.props;
    if (!blog) return null;
    const buttonText = 'Follow'
    return (
      <div className='follow-popover popover'>
        <header className='follow-popover-header' style={{ backgroundImage: `url(${blog.backgroundImageUrl})` }}>
          <nav className='follow-popover-nav'>
            <span className='blog-name'>{blog.name}</span>
            <button className='btn btn-default btn-white'>{buttonText}</button>
          </nav>
          <div className='avatar-wrapper'>
            <img className='avatar-default' src={blog.avatarImageUrl} />
          </div>
        </header>
        <main className='follow-popover-info'>
          <h1>{blog.title}</h1>
          <h2>{blog.description}</h2>
        </main>
      </div >
    );
  }

  componentDidMount() {
    const { fetchBlog } = this.props;
    fetchBlog();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowPopover);