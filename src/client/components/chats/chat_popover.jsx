import React from 'react';
import { connect } from 'react-redux';

import { GlobalContext } from '../global_ context_provider';
import { selectBlogs } from '../../selectors/selectors';
import { fetchUserFollowing } from '../../actions/user_actions';
import { openChatDrawer } from '../../actions/chat_actions';

const mapStateToProps = (state, _) => {
  const blogs = selectBlogs(state);
  return {
    blogs,
  };
};

const mapDispatchToProps = (dispatch, _) => {
  return {
    fetchUserFollowing: (userId, queryParams) => dispatch(fetchUserFollowing(userId, queryParams)),
    openChatDrawer: (chatDrawer) => dispatch(openChatDrawer(chatDrawer)),
  }
};

class ChatPopover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showChatForm: false,
      newChatWith: '',
    };

    this.renderHeader = this.renderHeader.bind(this);
    this.renderChatForm = this.renderChatForm.bind(this);
    this.renderChatIndex = this.renderChatIndex.bind(this);
    this.renderRecentlyFollowedSection = this.renderRecentlyFollowedSection.bind(this);
    this.renderBlogItem = this.renderBlogItem.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleChatForm = this.toggleChatForm.bind(this);
  }

  render() {
    let chatSection;
    if (this.state.showChatForm) {
      chatSection = this.renderChatForm();
    } else {
      chatSection = this.renderChatIndex();
    }
    return (
      <div className='chat-popover popover'>
        {this.renderHeader()}
        <div className='scrolling-container'>
          {chatSection}
          {this.renderRecentlyFollowedSection()}
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { currentUser } = this.context;
    const { fetchUserFollowing } = this.props;
    fetchUserFollowing(currentUser._id, { entity: 'blogs' });
  }

  renderHeader() {
    const { currentUser } = this.context;

    return (
      <section className='chat-popover-header'>
        {/* TODO: create Avatar component */}
        <div className='avatar avatar-extra-small'
          style={{ backgroundImage: `url(${currentUser.avatarImageUrl})` }}></div>
        <h1>
          {currentUser.username}
        </h1>
        <a onClick={this.handleClick('newChat')}>
          {(this.state.showChatForm) ? 'Nevermind' : 'New Message'}
        </a>
      </section>
    )
  }

  renderChatForm() {
    return (
      <form className='chat-form'
        onSubmit={this.handleSubmit}>
        <span>To: </span>
        <input type='text'
          name='newChatWith'
          autoFocus={true}
          value={this.state.newChatWith}
          onChange={this.handleChange('newChatWith')}
          onClick={(e) => e.stopPropagation() /* stop bubbling to window closePopover */} />
      </form>
    )
  }

  renderChatIndex() {
    return (
      <section className='popover-subsection'>
        <div className='popover-menu-item'>
          Working on chat feature! Stay tuned!
        </div>
      </section>
    );
  }

  renderRecentlyFollowedSection() {
    const { currentUser } = this.context;
    const { blogs } = this.props;
    let recentlyFollowed = currentUser.following.slice(-5).reverse();
    if (!recentlyFollowed || !recentlyFollowed.length) return null; // when user has not followed any blogs
    let followedBlogs = recentlyFollowed.map((blogId) => {
      const blog = blogs[blogId];
      return this.renderBlogItem(blog);
    });
    return (
      <section className='popover-subsection' >
        <header className='popover-header'>
          <span>Recently Followed</span>
        </header>
        <ul>
          {followedBlogs}
        </ul>
      </section>
    );
  }

  renderBlogItem(blog) {
    if (!blog) return null; // account for when blogs are not yet fetched
    return (
      <li key={blog._id}
        className='popover-menu-item'>
        <div className='blog-item'>
          <div className='blog-item-info'>
            <div className='avatar avatar-small'
              style={{ backgroundImage: `url(${blog.avatarImageUrl})` }} />
            <div className='blog-item-details'>
              <span className='blog-item-details-name'>{blog.name}</span>
              <span className='blog-item-details-title'>{blog.title}</span>
              <a>Send a message</a>
            </div>
          </div>
        </div>
      </li>
    );
  }

  handleClick(clickAction) {
    if (clickAction === 'newChat') return this.toggleChatForm;
  }

  handleChange(inputField) {
    const that = this;
    return function (e) {
      let newState = {};
      newState[inputField] = e.target.value;
      that.setState(newState);
    }
  }

  handleSubmit(e) {
    // TODO: only allow submit if user exists
    e.preventDefault();
    const { openChatDrawer } = this.props;
    openChatDrawer({ _id: this.state.newChatWith });
  }

  toggleChatForm(e) {
    e.stopPropagation(); // to stop bubbling up to window closePopover
    e.preventDefault();
    this.setState({ showChatForm: !this.state.showChatForm });
  }
}

ChatPopover.contextType = GlobalContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatPopover);