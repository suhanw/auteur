import React from 'react';
import PostShowText from './post_show_text';
import PostShowPhoto from './post_show_photo';

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
            src={blog.avatarImageUrl}
            id={post._id} />
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
    const postShowComponents = {
      'text': PostShowText,
      'photo': PostShowPhoto,
    };
    const Component = postShowComponents[post.type];
    return <Component post={post} />;
  }
}

export default PostShowItem;