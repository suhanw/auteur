import React from 'react';

class PostShowQuote extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { post } = this.props;
    return (
      <main className='post-main'>
        <h1 className='post-quote'
          dangerouslySetInnerHTML={{ __html: post.title }}></h1>
        <div className='post-source'>{post.body}</div>
      </main >
    )
  }
}

export default PostShowQuote;