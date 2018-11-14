import React from 'react';

class PostIndex extends React.Component {
  constructor(props) {
    super(props);

    this.renderPostIndexItem = this.renderPostIndexItem.bind(this);
  }

  render() {
    return (
      <ul className='post-index'>
        {this.renderPostIndexItem()}
      </ul>
    );
  }

  renderPostIndexItem() {
    const { postsArr, blogs } = this.props;
    let postLis = postsArr.map(function (post) {
      return (
        <li>{post._id}</li>
      );
    });
    return postLis;
  }

  componentDidMount() {
    const { fetchPosts } = this.props;
    fetchPosts();
  }
}

export default PostIndex;