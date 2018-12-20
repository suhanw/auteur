import React from 'react';
import PostShowText from './post_show_text';
import PostShowPhoto from './post_show_photo';
import PostShowQuote from './post_show_quote';
import PostShowLink from './post_show_link';
import PostFormContainer from '../post_forms/post_form_container';
import NoteMenuContainer from '../../notes/note_menu_container';
import TagIndex from '../../tags/tag_index';
import { GlobalContext } from '../../global_ context_provider';
import { showPopover, hidePopover, renderFollowPopover } from '../../follows/follow_popover_util';

class PostShowItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPostForm: false,
      postFollowPopover: null,
      avatarFollowPopover: null,
    };

    this.postShowComponents = {
      'text': PostShowText,
      'photo': PostShowPhoto,
      'quote': PostShowQuote,
      'link': PostShowLink,
    };

    this.postShowItemRef = React.createRef();

    this.renderAvatar = this.renderAvatar.bind(this);
    this.renderPostContent = this.renderPostContent.bind(this);
    this.renderPostShow = this.renderPostShow.bind(this);
    this.handleClickFollow = this.handleClickFollow.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.togglePostForm = this.togglePostForm.bind(this);
  }

  render() {
    const { post, blog } = this.props;
    if (this.state.showPostForm) {
      return <PostFormContainer post={post}
        blog={blog}
        edit={true}
        togglePostForm={this.togglePostForm} />
    }

    return (
      <li className='post-show-item' ref={this.postShowItemRef}>

        {this.renderAvatar()}
        {this.renderPostContent()}

        {renderFollowPopover(this, blog._id, 'avatarFollowPopover')}
        {renderFollowPopover(this, blog._id, 'postFollowPopover')}

      </li >
    );
  }

  renderAvatar() {
    const { view, blog } = this.props;
    if (view === 'blogDrawer' ||
      view === 'searchPosts') return null;
    return (
      <picture className='avatar-container'>
        <div className='avatar'>

          <div
            className='avatar-default'
            style={{ backgroundImage: `url(${blog.avatarImageUrl})` }}
            onMouseEnter={showPopover(this, 'avatarFollowPopover')}
            onMouseLeave={hidePopover(this, 'avatarFollowPopover')}
            onClick={this.toggleDrawer} />


        </div>
      </picture>
    );
  }

  renderSmallAvatar() {
    const { blog } = this.props;
    return (
      <picture className='avatar-container'>
        <div className='avatar'>
          <div
            className='avatar-extra-small'
            style={{ backgroundImage: `url(${blog.avatarImageUrl})` }}
            onMouseEnter={showPopover(this, 'avatarFollowPopover')}
            onMouseLeave={hidePopover(this, 'avatarFollowPopover')}
            onClick={this.toggleDrawer} />
        </div>
      </picture>
    )
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
    const { post, blog, view } = this.props;
    const { currentUser } = this.context;
    let smallAvatar = null;
    let suggestFollow = null;
    let followLink = null;
    let blogNameClass = '';

    // if not already followed, suggest user to follow blog
    if (blog.author !== currentUser._id && !currentUser.following.includes(blog._id)) {
      suggestFollow = <small>Here's a blog: </small>
      followLink = <a onClick={this.handleClickFollow}>Follow</a>
      blogNameClass = 'unfollowed';
    }

    if (view === 'searchPosts' ||
      window.innerWidth <= 812) {
      smallAvatar = this.renderSmallAvatar();
      suggestFollow = null;
    }

    return (
      <article className='post-content'>
        <div className='dogear'></div>
        <header className='post-header'>
          {smallAvatar}
          {suggestFollow}
          <span className={`post-blog-name ${blogNameClass}`}
            onMouseEnter={showPopover(this, 'postFollowPopover')}
            onMouseLeave={hidePopover(this, 'postFollowPopover')}
            onClick={this.toggleDrawer} >
            {blog.name}
          </span>
          {followLink}
        </header>

        {this.renderPostShow()}

        <footer className='post-footer'>
          <TagIndex postId={post._id}
            tags={post.tags} />
          <NoteMenuContainer
            view={view}
            post={post}
            togglePostForm={this.togglePostForm}
            postShowItemRef={this.postShowItemRef} />
        </footer>
      </article >
    );
  }

  renderPostShow() {
    const { post } = this.props;

    const PostShowComponent = this.postShowComponents[post.type];
    return <PostShowComponent post={post} />;
  }

  handleClickFollow(e) {
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

PostShowItem.contextType = GlobalContext;

export default PostShowItem;