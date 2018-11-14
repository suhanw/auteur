import React from 'react';

class PostShowText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { post } = this.props;
    return (
      <div>
        <h1 className='post-title'>{post.title}</h1>
        <p className='post-body'>
          {post.body}
        </p>
      </div>
    )
  }
}

export default PostShowText;