import React from 'react';
import PostShowText from './post_show_text';
import PostShowPhoto from './post_show_photo';
import PostShowQuote from './post_show_quote';
import PostShowLink from './post_show_link';
import PostFormContainer from '../post_forms/post_form_container';
import NoteMenuContainer from '../../notes/note_menu_container';
import TagIndex from '../../tags/tag_index';
import { showPopover, hidePopover, renderFollowPopover } from '../../follows/follow_popover_util';

class PostShowItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postFollowPopover: false,
      avatarFollowPopover: false,
      showPostForm: false,
    };

    this.postShowComponents = {
      'text': PostShowText,
      'photo': PostShowPhoto,
      'quote': PostShowQuote,
      'link': PostShowLink,
    };

    this.renderAvatar = this.renderAvatar.bind(this);
    this.renderPostContent = this.renderPostContent.bind(this);
    this.renderPostShow = this.renderPostShow.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.togglePostForm = this.togglePostForm.bind(this);
  }

  render() {
    // FIX: fade out when deleted
    const { post, blog } = this.props;
    if (this.state.showPostForm) {
      return <PostFormContainer post={post}
        blog={blog}
        edit={true}
        togglePostForm={this.togglePostForm} />
    }

    return (
      <li className='post-show-item'>

        {this.renderPostContent()}

        {this.renderAvatar()}

      </li >
    );
  }

  renderAvatar() {
    const { view, blog } = this.props;
    if (view === 'blogDrawer') return null;
    return (
      <picture className='avatar-container'>
        <div className='avatar'>

          <div
            className='avatar-default'
            style={{ backgroundImage: `url(${blog.avatarImageUrl})` }}
            onMouseOver={showPopover(this, 'avatarFollowPopover')}
            onMouseOut={hidePopover(this, true, 'avatarFollowPopover')}
            onClick={this.toggleDrawer} />

          {renderFollowPopover(this, blog._id, 'avatarFollowPopover')}

        </div>
      </picture>
    );
  }

  toggleDrawer(e) {
    e.preventDefault();
    const { openDrawer, blog } = this.props;
    let blogDrawer = {
      view: 'blog',
      data: blog,
    };
    openDrawer(blogDrawer);
  }

  renderPostContent() {
    const { post, blog, currentUser, view } = this.props;
    let suggestFollow = null;
    let followLink = null;
    let blogNameClass = '';

    // if not already followed, suggest user to follow blog
    if (blog.author !== currentUser._id && !currentUser.following.includes(blog._id)) {
      suggestFollow = <small>Here's a blog: </small>
      followLink = <a onClick={this.handleClick}>Follow</a>
      blogNameClass = 'unfollowed';
    }

    return (
      <article className='post-content'>
        {/* FIX: dogear doesn't render correctly in blog drawer */}
        <div className='dogear'></div>
        <header className='post-header'>
          {suggestFollow}
          <span className={`post-blog-name ${blogNameClass}`}
            onMouseOver={showPopover(this, 'postFollowPopover')}
            onMouseOut={hidePopover(this, true, 'postFollowPopover')}>
            <span>{blog.name}</span>
            {renderFollowPopover(this, blog._id, 'postFollowPopover')}
          </span>
          {followLink}
        </header>

        {this.renderPostShow()}

        <footer className='post-footer'>
          <TagIndex />
          <NoteMenuContainer
            view={view}
            post={post}
            togglePostForm={this.togglePostForm} />
        </footer>
      </article >
    );
  }

  renderPostShow() {
    const { post } = this.props;

    const PostShowComponent = this.postShowComponents[post.type];
    return <PostShowComponent post={post} />;
  }

  handleClick(e) {
    e.preventDefault();
    const { createFollow, blog } = this.props;
    createFollow(blog._id);
  }

  togglePostForm() {
    const { showPostForm } = this.state;
    let newValue = !showPostForm;
    this.setState({ showPostForm: newValue });
  }
}

export default PostShowItem;