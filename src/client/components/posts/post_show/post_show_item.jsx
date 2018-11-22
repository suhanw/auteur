import React from 'react';
import { Route } from 'react-router-dom';
import PostShowText from './post_show_text';
import PostShowPhoto from './post_show_photo';
import NoteMenuContainer from '../../notes/note_menu_container';
import FollowPopover from '../../follows/follow_popover';
import { log } from 'util';

class PostShowItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      followPopover: false,
    };

    this.renderPostContent = this.renderPostContent.bind(this);
    this.renderPostShow = this.renderPostShow.bind(this);
    this.renderFollowPopover = this.renderFollowPopover.bind(this);
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
  }

  render() {
    // FIX: fade out when deleted
    const { blog } = this.props;
    // let postDate = new Date(post.createdAt);
    // postDate = postDate.toString();
    return (
      <li className='post-show-item'>
        <picture className='avatar-container'>
          <img
            className='avatar avatar-default'
            src={blog.avatarImageUrl} />
        </picture>

        {this.renderPostContent()}

      </li >
    );
  }

  renderPostContent() {
    const { post, blog } = this.props;
    return (
      <article className='post-content'>
        <div className='dogear'></div>
        <header className='post-header'>
          <span className='post-blog-name'
            onMouseOver={this.openPopover}
            onMouseOut={this.closePopover}>
            <span>{blog.name}</span>
            {this.renderFollowPopover()}
          </span>
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
    };
    const Component = postShowComponents[post.type];
    return <Component post={post} />;
  }

  renderFollowPopover() {
    const { blog } = this.props;
    const { followPopover } = this.state;
    if (followPopover) return <FollowPopover blogId={blog._id} />
    return null;
    // return <FollowPopover blogId={blog._id} />
  }

  openPopover(e) {
    // console.log(e.target);
    this.setState({ followPopover: true });
  }

  closePopover(e) {
    const elPosY = e.currentTarget.getBoundingClientRect().top; // y coord measured from top of element
    const elHeight = e.currentTarget.clientHeight; // height of element
    const cursorPosY = e.clientY; // y coord of cursor

    console.log('e.target.className', e.target.className);

    if (e.currentTarget.className === 'post-blog-name' && cursorPosY > elPosY + elHeight) { // if cursor is below the hover area
      // debugger
      return; // do nothing
    }

    this.setState({ followPopover: false });
  }
}

export default PostShowItem;