import React from 'react';

import PostIndexHeader from './post_index_header';
import PostShowItem from './post_show_item';

class PostIndex extends React.Component {
  constructor(props) {
    super(props);

    this.renderPostShowItems = this.renderPostShowItems.bind(this);
  }

  render() {
    const { currentUser } = this.props;
    return (
      <div className='post-index'>
        <PostIndexHeader currentUser={currentUser} />
        <ul className='post-container'>
          {this.renderPostShowItems()}
        </ul>
      </div>
    );
  }

  renderPostShowItems() {
    const { postsArr, blogs } = this.props;
    let postIndexItems = postsArr.map(function (post) {
      let blog = blogs[post.blog];
      return (
        <PostShowItem key={post._id} post={post} blog={blog} />
      );
    });
    return postIndexItems;
  }

  componentDidMount() {
    const { fetchPosts } = this.props;
    fetchPosts();
  }
}

export default PostIndex;