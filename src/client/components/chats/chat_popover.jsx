import React from 'react';
import { connect } from 'react-redux';

import { selectBlogs } from '../../selectors/selectors';
import { GlobalContext } from '../global_ context_provider';

const mapStateToProps = (state, _) => {
  const blogs = selectBlogs(state);
  return {
    blogs,
  };
};

const mapDispatchToProps = (dispatch, _) => {

};

class ChatPopover extends React.Component {
  constructor(props) {
    super(props);

    this.renderRecentlyFollowed = this.renderRecentlyFollowed.bind(this);
  }

  render() {
    return (
      <div className='chat-popover popover'>
        {this.renderHeader()}
        {this.renderRecentlyFollowed()}
      </div>
    );
  }

  renderHeader() {
    const { currentUser } = this.context;

    return (
      <section className='chat-popover-header'>
        <div className='avatar avatar-extra-small'
          style={{ backgroundImage: `url(${currentUser.avatarImageUrl})` }}></div>
        <h1>
          {currentUser.username}
        </h1>
        <a>
          New Message
        </a>
      </section>
    )
  }

  renderRecentlyFollowed() {
    let followedBlogs = <li className='popover-menu-item'>Blog</li>;
    return (
      <section className='popover-subsection'>
        <header className='popover-header'>
          <span>Recently Followed</span>
        </header>
        <ul>
          {followedBlogs}
        </ul>
      </section>
    );
  }

}

ChatPopover.contextType = GlobalContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatPopover);