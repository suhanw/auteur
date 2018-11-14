import React from 'react';

class PostShowItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { post, blog } = this.props;
    return (
      <li className='post-show-item'>
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

export default PostShowItem;