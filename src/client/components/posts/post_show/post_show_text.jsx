import React from 'react';

class PostShowText extends React.Component {
  constructor(props) {
    super(props);

    this.renderBody = this.renderBody.bind(this);
  }

  render() {
    const { post } = this.props;
    return (
      <main className='post-main'>
        <h1 className='post-title'>{post.title}</h1>
        {this.renderBody()}
      </main >
    )
  }

  renderBody() {
    const { post } = this.props;
    if (!post.body) return null;
    return (
      <div className='post-body'
        dangerouslySetInnerHTML={{ __html: post.body }}>
      </div>
    )
  }

}

export default PostShowText;