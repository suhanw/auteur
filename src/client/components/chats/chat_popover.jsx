import React from 'react';
import { connect } from 'react-redux';

import { GlobalContext } from '../global_ context_provider';
import { selectBlogs, selectUsers, selectSearchUsers } from '../../selectors/selectors';
import { fetchUserFollowing } from '../../actions/user_actions';
import { fetchSearchUsers } from '../../actions/search_actions';
import { openChatDrawer } from '../../actions/chat_actions';

const mapStateToProps = (state, _) => {
  const blogs = selectBlogs(state);
  const users = selectUsers(state);
  const searchUsers = selectSearchUsers(state);
  return {
    blogs,
    users,
    searchUsers,
  };
};

const mapDispatchToProps = (dispatch, _) => {
  return {
    fetchUserFollowing: (userId, queryParams) => dispatch(fetchUserFollowing(userId, queryParams)),
    fetchSearchUsers: (userQuery) => dispatch(fetchSearchUsers(userQuery)),
    openChatDrawer: (chatDrawer) => dispatch(openChatDrawer(chatDrawer)),
  }
};

class ChatPopover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showChatForm: false,
      newChatPartner: '',
    };

    this.renderHeader = this.renderHeader.bind(this);
    this.renderChatForm = this.renderChatForm.bind(this);
    this.renderPotentialChatPartners = this.renderPotentialChatPartners.bind(this);
    this.renderChatIndex = this.renderChatIndex.bind(this);
    this.renderRecentlyFollowedSection = this.renderRecentlyFollowedSection.bind(this);
    this.renderBlogItem = this.renderBlogItem.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleChatForm = this.toggleChatForm.bind(this);
  }

  render() {
    let chatSection;
    if (this.state.showChatForm) {
      chatSection = this.renderChatForm();
    } else {
      // chatSection = this.renderChatIndex();
      chatSection = null;
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
      <section className='popover-subsection'>
        <form className='chat-form'
          onSubmit={(e) => e.preventDefault() /* force current user to select from search user results */}>
          <span>To: </span>
          <input type='text'
            name='newChatPartner'
            autoFocus={true}
            value={this.state.newChatPartner}
            onChange={this.handleChange}
            onClick={(e) => e.stopPropagation() /* stop bubbling to window closePopover */} />
        </form>
        {this.renderPotentialChatPartners()}
      </section>
    )
  }

  renderPotentialChatPartners() {
    const { newChatPartner } = this.state;
    const { users, searchUsers } = this.props;
    if (!newChatPartner.length) return null; // if no text in input field, render nothing
    let potentialChatPartners = searchUsers.map((userId) => {
      let user = users[userId];
      if (!user) return null; // if user hasn't been fetched yet
      let username = user.username;
      let userQueryRegex = new RegExp(`(.*)(${newChatPartner})(.*)`); // to underline the part of username that matches query string
      let usernameArr = username.match(userQueryRegex);
      if (!usernameArr) return null; // if users haven't been updated on change of query term
      return (
        <li key={`search_${user._id}`}
          className='popover-menu-item blog-item'
          tabIndex='0'
          onClick={this.handleClick(user.username)}>
          <div className='avatar avatar-small'
            style={{ backgroundImage: `url(${user.avatarImageUrl})` }} />
          <div className='blog-item-details'>
            <span className='blog-item-details-name'>
              {usernameArr[1]}
              <u>{usernameArr[2]}</u>
              {usernameArr[3]}
            </span>
          </div>
        </li>
      );
    });
    return (
      <ul>
        {potentialChatPartners}
      </ul>
    );
  }

  renderChatIndex() {
    // TODO: render most recent chats
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
    const { users } = this.props;
    let author = users[blog.author];
    if (!author) return null; // account for when the author is not yet fetched
    return (
      <li key={`blog_${author._id}`}
        className='popover-menu-item blog-item'
        onClick={this.handleClick(author.username)}>
        <div className='avatar avatar-small'
          style={{ backgroundImage: `url(${blog.avatarImageUrl})` }} />
        <div className='blog-item-details'>
          <span className='blog-item-details-name'>{author.username}</span>
          <span className='blog-item-details-title'>{blog.title}</span>
          <a>Send a message</a>
        </div>
      </li>
    );
  }

  handleClick(clickAction) {
    if (clickAction === 'newChat') return this.toggleChatForm;
    // to handle clicks on recently followed, clickAction will be populated with chat partner's username
    else return (e) => { this.props.openChatDrawer(clickAction) };
  }

  handleChange(e) {
    this.setState({ newChatPartner: e.target.value }, () => {
      const { newChatPartner } = this.state;
      if (newChatPartner.length) this.props.fetchSearchUsers(newChatPartner); // only search when query is not blank
    });
  }

  toggleChatForm(e) {
    e.stopPropagation(); // to stop bubbling up to window closePopover
    e.preventDefault();
    this.setState({ showChatForm: !this.state.showChatForm });
  }
}

ChatPopover.contextType = GlobalContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatPopover);