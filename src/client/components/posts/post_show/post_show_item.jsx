import React from 'react';
import PostShowText from './post_show_text';
import PostShowPhoto from './post_show_photo';
import PostShowQuote from './post_show_quote';
import PostShowLink from './post_show_link';
import NoteMenuContainer from '../../notes/note_menu_container';
import { showPopover, hidePopover, renderFollowPopover } from '../../../util/popover_util';

class PostShowItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postFollowPopover: false,
      avatarFollowPopover: false,
    };

    this.renderPostContent = this.renderPostContent.bind(this);
    this.renderPostShow = this.renderPostShow.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    // FIX: fade out when deleted
    const { blog } = this.props;
    return (
      <li className='post-show-item'>

        {this.renderPostContent()}

        <picture className='avatar-container'>
          <div className='avatar'>

            <img
              className='avatar-default'
              src={blog.avatarImageUrl}
              onMouseOver={showPopover(this, 'avatarFollowPopover')}
              onMouseOut={hidePopover(this, true, 'avatarFollowPopover')} />

            {renderFollowPopover(this, blog._id, 'avatarFollowPopover')}

          </div>
        </picture>

      </li >
    );
  }

  renderPostContent() {
    const { post, blog, currentUser } = this.props;
    let suggestFollow = null;
    let followLink = null;
    let blogNameClass = '';
    if (post.author !== currentUser._id && !currentUser.following.includes(post._id)) {
      suggestFollow = <small>Here's a blog: </small>
      followLink = <a onClick={this.handleClick}>Follow</a>
      blogNameClass = 'unfollowed';
    }
    return (
      <article className='post-content'>
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
          <div className='tag-index'>This will be TagIndex</div>
          <NoteMenuContainer post={post} />
        </footer>
      </article >
    );
  }

  renderPostShow() {
    const { post } = this.props;
    const postShowComponents = {
      'text': PostShowText,
      'photo': PostShowPhoto,
      'quote': PostShowQuote,
      'link': PostShowLink,
    };
    const Component = postShowComponents[post.type];
    return <Component post={post} />;
  }

  handleClick(e) {
    e.preventDefault();
    const { createFollow, blog } = this.props;
    createFollow(blog._id);
  }
}

export default PostShowItem;