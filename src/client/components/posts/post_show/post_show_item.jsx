import React from 'react';
import { Route } from 'react-router-dom';
import PostShowText from './post_show_text';
import PostShowPhoto from './post_show_photo';
import NoteMenuContainer from '../../notes/note_menu_container';

class PostShowItem extends React.Component {
  constructor(props) {
    super(props);

    this.renderPostContent = this.renderPostContent.bind(this);
    this.renderPostShow = this.renderPostShow.bind(this);
  }

  render() {
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

      </li>
    );
  }

  renderPostContent() {
    const { post, blog } = this.props;
    return (
      <article className='post-content'>
        <div className='dogear'></div>
        <header className='post-header'>
          {blog.name}
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
}

export default PostShowItem;