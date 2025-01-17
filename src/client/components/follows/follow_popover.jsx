import React from 'react';
import { connect } from 'react-redux';

import { fetchBlog } from '../../actions/blog_actions';
import { createFollow, deleteFollow } from '../../actions/follow_actions';
import { selectBlog } from '../../selectors/selectors';
import { GlobalContext } from '../global_ context_provider';

const mapStateToProps = function (state, ownProps) {
  // TODO: select top 3 posts with most notes
  return {
    blog: selectBlog(state, ownProps.blogId),
  }
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    fetchBlog: (blogId) => dispatch(fetchBlog(blogId)),
    createFollow: (blogId) => dispatch(createFollow(blogId)),
    deleteFollow: (blogId) => dispatch(deleteFollow(blogId)),
  };
};

class FollowPopover extends React.Component {
  constructor(props) {
    super(props);

    this.renderButton = this.renderButton.bind(this);
  }

  render() {
    const { blog, hidePopover, popover } = this.props;
    if (!blog) return null;
    const popoverStyle = {
      top: popover.posY,
      left: popover.posX,
      paddingTop: popover.paddingTop,
    };

    return (
      <div className='follow-popover'
        style={popoverStyle}
        onMouseLeave={hidePopover}>
        <header className='follow-popover-header'
          style={{ backgroundImage: `url(${blog.backgroundImageUrl})` }}>
          <nav className='follow-popover-nav'>
            <span className='blog-name'>{blog.name}</span>
            {this.renderButton()}
          </nav>
          <div className='avatar-wrapper'>
            <img className='avatar-default'
              style={{ backgroundImage: `url(${blog.avatarImageUrl})` }} />
          </div>
        </header>
        <main className='follow-popover-info'>
          <h1 className='object-fade-in'>{blog.title}</h1>
          <h2 className='object-fade-in'>{blog.description}</h2>
        </main>
      </div >
    );
  }

  renderButton() {
    const { currentUser } = this.context;
    const { blog } = this.props;
    let buttonText = '';
    if (blog.author === currentUser._id) {
      buttonText = 'Edit appearance';
    } else if (currentUser.following.includes(blog._id)) {
      buttonText = 'Unfollow';
    } else {
      buttonText = 'Follow';
    }
    return (
      <button className='btn btn-default btn-white'
        onClick={this.handleSubmit(buttonText)}>
        {buttonText}
      </button>
    );
  }

  handleSubmit(buttonText) {
    const { createFollow, deleteFollow, blogId } = this.props;
    const submitActions = {
      'Follow': createFollow,
      'Unfollow': deleteFollow,
      'Edit appearance': null,
    };
    return function (e) {
      e.preventDefault();
      const submitAction = submitActions[buttonText];
      if (submitAction) submitAction(blogId);
    }
  }

  componentDidMount() {
    const { blog, fetchBlog, blogId } = this.props;
    if (!blog) fetchBlog(blogId);
  }
}

FollowPopover.contextType = GlobalContext;

export default connect(mapStateToProps, mapDispatchToProps)(FollowPopover);