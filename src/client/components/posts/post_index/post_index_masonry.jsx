import React from 'react';

import PostShowItem from '../post_show/post_show_item';

class PostIndexMasonry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let n = 4;
    return (
      <div className='masonry-wall'>
        {this.renderColumns(n)}
      </div>
    );
  }

  renderColumns(n) {
    const { postsArr } = this.props;
    let masonryColArr = [];
    postsArr.forEach((post, i) => {
      let brick = this.renderBrick(post);
      if (!masonryColArr[i % n]) masonryColArr[i % n] = [];
      masonryColArr[i % n].push(brick);
    });

    let masonryColumns = masonryColArr.map((col, i) => {
      return (
        <ul className={`masonry-col-${i}`} key={i}>
          {col}
        </ul>
      );
    })
    return masonryColumns;
  }

  renderBrick(post) {
    const { view, blogs, currentUser, createFollow, openDrawer } = this.props;
    let blog = blogs[post.blog];
    return (
      <PostShowItem key={post._id}
        view={view}
        post={post}
        blog={blog}
        currentUser={currentUser}
        createFollow={createFollow}
        openDrawer={openDrawer} />
    );
  }
}

export default PostIndexMasonry;