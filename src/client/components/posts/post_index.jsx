import React from 'react';

import PostIndexHeader from './post_index_header';
import PostShowItem from './post_show/post_show_item';

import { renderSpinner } from '../../util/misc_util';
import { log } from 'util';

class PostIndex extends React.Component {
  constructor(props) {
    super(props);

    this.renderPostIndexHeader = this.renderPostIndexHeader.bind(this);
    this.renderPostShowItems = this.renderPostShowItems.bind(this);
  }

  render() {
    // FIX: add error handlers!!
    const { loadingPostIndex } = this.props;

    let spinnerClass = (loadingPostIndex) ? 'loading-post-index' : null;

    return (
      <div className='post-index'>
        {this.renderPostIndexHeader()}
        <ul className='post-container'>
          {this.renderPostShowItems()}
        </ul>
        {renderSpinner(spinnerClass)}
      </div>
    );
  }

  renderPostIndexHeader() {
    const { currentUser, view } = this.props;
    if (view === 'likes' || view === 'following') return null;
    return (
      <PostIndexHeader currentUser={currentUser} />
    )
  }

  renderPostShowItems() {
    const { view, postsArr, blogs, blogId, currentUser, createFollow } = this.props;

    if (blogs[blogId] && blogs[blogId].postCount === 0) { // if blog has no posts
      return <div className='post-blank'>
        <img className='not-found-icon' src='images/notFound.png' />
        No posts found.
      </div>;
    } else if (view === 'likes' && currentUser.likeCount === 0 ||
      view === 'following' && currentUser.following.length === 0) {
      return <div className='post-blank'>
        <img className='not-found-icon' src='images/notFound.png' />
        No posts to display.
      </div>;
    }

    if (postsArr.length === 0) return null;

    let postIndexItems = postsArr.map(function (post) {
      let blog = blogs[post.blog];

      // FIX: scroll to the PostForm position when editing
      return (
        <div key={post._id} >
          <PostShowItem
            post={post}
            blog={blog}
            currentUser={currentUser}
            createFollow={createFollow} />
        </div>
      );
    });
    // FIX: think of a better way to render follow popover so that it doesn't depend on ordering of lis
    return postIndexItems.reverse();
  }

  componentDidMount() {
    const { fetchPosts, fetchUserLikes, currentUser } = this.props;
    fetchPosts();
    if (!currentUser.likedPosts) fetchUserLikes(currentUser._id); // to fetch only when it's not populated
  }

  componentWillReceiveProps(newProps) {
    // to call fetch when view changes
    const oldView = this.props.view;
    const newView = newProps.view;
    const { fetchPosts, fetchUserLikes, currentUser } = newProps;
    const oldBlogId = this.props.match.params.blogId;
    const newBlogId = newProps.match.params.blogId;
    if (newView !== oldView || oldBlogId !== newBlogId) {
      fetchPosts();
      if (!currentUser.likedPosts) fetchUserLikes(currentUser._id); // to fetch only when it's not populated
    }
  }
}

export default PostIndex;