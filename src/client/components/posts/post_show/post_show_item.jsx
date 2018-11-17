import React from 'react';
import PostShowText from './post_show_text';
import PostShowPhoto from './post_show_photo';
import NoteMenuContainer from '../../notes/note_menu_container';

class PostShowItem extends React.Component {
  constructor(props) {
    super(props);

    this.renderPostShow = this.renderPostShow.bind(this);
  }

  render() {
    const { post, blog } = this.props;
    let postDate = new Date(post.createdAt);
    postDate = postDate.toString();
    return (
      <li className='post-show-item'>
        <picture className='avatar-container'>
          <img
            className='avatar avatar-default'
            src={blog.avatarImageUrl} />
        </picture>
        <article className='post-content'>
          <div className='dogear'></div>
          <header className='post-header'>
            {blog.name}
            &nbsp;{blog._id}
          </header>

          {this.renderPostShow()}

          <footer className='post-footer'>
            {post._id}
            <div className='tag-index'>This will be TagIndex</div>
            <NoteMenuContainer post={post} />
          </footer>
        </article>
      </li>
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