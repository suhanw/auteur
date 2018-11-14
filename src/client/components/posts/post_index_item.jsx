import React from 'react';

class PostIndexItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { post, blog } = this.props;
    return (
      <li className='post-index-item'>
        <picture className='avatar avatar-default'>
          <img src={blog.avatarImageUrl} />
        </picture>
        <article className='post-content'>
          {post._id}
        </article>
      </li>
    );
  }
}

export default PostIndexItem;