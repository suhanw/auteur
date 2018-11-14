import React from 'react';
import PostShowText from './post_show_text';

class PostShowItem extends React.Component {
  constructor(props) {
    super(props);

    this.renderPostShow = this.renderPostShow.bind(this);
  }

  render() {
    const { post, blog } = this.props;
    return (
      <li className='post-show-item'>
        <picture className='avatar-container'>
          <img className='avatar avatar-default' src={blog.avatarImageUrl} />
        </picture>
        <article className='post-content'>
          <header className='post-header'>
            {blog.title}
          </header>

          <main className='post-main'>
            {this.renderPostShow()}
          </main>

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
      default:
        return null;
    }
  }
}

export default PostShowItem;