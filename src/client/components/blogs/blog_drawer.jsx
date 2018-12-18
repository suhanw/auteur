import React from 'react';

import PostIndexContainer from '../posts/post_index/post_index_container';
import { GlobalContext } from '../global_ context_provider';

class BlogDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.renderHeader = this.renderHeader.bind(this);
    this.renderPostIndex = this.renderPostIndex.bind(this);
    this.renderFollowButton = this.renderFollowButton.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div className='blog-drawer'>
        {this.renderHeader()}

        {this.renderPostIndex()}
      </div>
    )
  }

  renderHeader() {
    const { data } = this.props;
    const avatarStyle = { backgroundImage: `url(${data.avatarImageUrl})` };
    const headerImageStyle = { backgroundImage: `url(${data.backgroundImageUrl})` };

    return (
      <header className='blog-drawer-header'>
        <div className='blog-drawer-header-image'
          style={headerImageStyle}>
          <nav className='blog-drawer-nav'>
            <span className='blog-name'>
              {data.name}
            </span>
            {this.renderFollowButton()}
          </nav>
        </div>
        <div className='blog-drawer-avatar-wrapper'>
          <div className='avatar avatar-large'
            style={avatarStyle}>
          </div>
        </div>
        <div className='blog-drawer-info'>
          <h1 className='blog-title'>
            {data.title}
          </h1>
          <p className='blog-description'>
            {data.description}
          </p>
        </div>
      </header>
    )
  }

  renderFollowButton() {
    const { currentUser } = this.context;
    const { data } = this.props;
    let buttonText = '';
    if (data.author === currentUser._id) {
      buttonText = 'Edit appearance';
    } else if (currentUser.following.indexOf(data._id) < 0) {
      buttonText = 'Follow';
    } else {
      buttonText = 'Unfollow';
    }
    return (
      <button
        className='btn btn-default btn-white'
        onClick={this.handleSubmit(buttonText)}>
        {buttonText}
      </button>
    );
  }

  handleSubmit(buttonText) {
    const { createFollow, deleteFollow, data } = this.props;
    const submitActions = {
      'Follow': createFollow,
      'Unfollow': deleteFollow,
      'Edit appearance': null,
    };
    return function (e) {
      e.preventDefault();
      const submitAction = submitActions[buttonText];
      if (submitAction) submitAction(data._id);
    }
  }

  renderPostIndex() {
    const { data } = this.props;

    return (
      <section className='blog-drawer-posts'>
        <PostIndexContainer
          view='blogDrawer'
          blogId={data._id}
        />
      </section>
    );
  }
}


BlogDrawer.contextType = GlobalContext;

export default BlogDrawer;