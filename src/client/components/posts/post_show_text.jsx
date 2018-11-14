import React from 'react';

class PostShowText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { post } = this.props;
    return (
      <div>
        <h1>Title</h1>
        <p>
          {post.body}
        </p>
      </div>
    )
  }
}