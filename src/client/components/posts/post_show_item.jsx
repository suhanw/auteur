import React from 'react';
import PostShowText from './post_show_text';
import PostShowPhoto from './post_show_photo';
import Dashboard from '../dashboard';
import { log } from 'util';

class PostShowItem extends React.Component {
  constructor(props) {
    super(props);

    this.renderPostShow = this.renderPostShow.bind(this);
    this.offsetAvatar = this.offsetAvatar.bind(this);
  }

  render() {
    const { post, blog } = this.props;
    let postDate = new Date(post.createdAt);
    postDate = postDate.toString();
    return (
      <li className='post-show-item'>
        <picture className='avatar-container' onScroll={this.offsetAvatar}>
          <img className='avatar avatar-default' src={blog.avatarImageUrl} />
        </picture>
        <article className='post-content'>
          <div className='dogear'></div>
          <header className='post-header'>
            {blog.name}
          </header>

          {this.renderPostShow()}

          <footer className='post-footer'>
            <div className='tag-index'>This will be TagIndex</div>
            <div className='note-menu'>This will be NoteMenu</div>
          </footer>
        </article>
      </li>
    );
  }

  renderPostShow() {
    const { post } = this.props;
    switch (post.type) {
      case 'text':
        return <PostShowText post={post} />;
      case 'photo':
        return <PostShowPhoto post={post} />;
      default:
        return null;
    }
  }

  offsetAvatar(e) {
    console.log('scrolling');

    // onscroll, detect avatar position
    // if avatar top is less than 70 px from viewport top
    // if (dashboard.scrollTop - avatar.offsetTop < 70 &&
    //   dashboard.scrollTop + avatar.clientHeight > avatar_container.offsetTop + avatar_container.clientHeight) {
    //   avatar.style.top = `${dashboard.scrollTop - avatar.offsetTop}px`;
    // }
    // then increment avatar top position
    // unless avatar bottom is at the bottom of the avatar container
  }
}

export default PostShowItem;