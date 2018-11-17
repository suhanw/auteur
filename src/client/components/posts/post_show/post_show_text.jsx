import React from 'react';

class PostShowText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { post } = this.props;
    return (
      <main className='post-main'>
        <h1 className='post-title'>{post.title}</h1>
        <div className='post-body'
          dangerouslySetInnerHTML={{ __html: post.body }}>
        </div>
      </main >
    )
  }
}

export default PostShowText;