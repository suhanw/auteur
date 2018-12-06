import React from 'react';

import PostIndexHeader from './post_index_header';
import PostShowItem from './post_show/post_show_item';

import { renderSpinner } from '../../util/misc_util';

class PostIndex extends React.Component {
  constructor(props) {
    super(props);

    this.lastPost;

    this.renderPostIndexHeader = this.renderPostIndexHeader.bind(this);
    this.renderPostShowItems = this.renderPostShowItems.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.scrollFetch = this.scrollFetch.bind(this);
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

  componentDidMount() {
    const { view, fetchPosts, fetchUserLikes, currentUser } = this.props;
    if (!currentUser.likedPosts) fetchUserLikes(currentUser._id); // to fetch only when it's not populated
    fetchPosts();
    document.querySelector('div.dashboard') // event only fires on element that has overflow: scroll
      .addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(newProps) {
    // to call fetch when view changes
    const oldView = this.props.view;
    const newView = newProps.view;
    const { fetchPosts, fetchUserLikes, currentUser } = newProps;
    const oldBlogId = this.props.match.params.blogId;
    const newBlogId = newProps.match.params.blogId;
    if (newView !== oldView || oldBlogId !== newBlogId) { // to fetch posts when view changes
      if (!currentUser.likedPosts) fetchUserLikes(currentUser._id); // to fetch only when it's not populated
      fetchPosts();
    }
  }

  componentWillUnmount() {
    const { view } = this.props;
    document.querySelector('div.dashboard')
      .removeEventListener('scroll', this.handleScroll);
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

  handleScroll(e) {
    const scrollHeight = e.currentTarget.scrollHeight; // full length of the feed currently rendered
    const clientHeight = e.currentTarget.clientHeight; // visible height of feed
    const scrollTop = e.currentTarget.scrollTop; // distance from the top measured from top of window viewport

    if (scrollTop + clientHeight >= scrollHeight) { // when user hits bottom of feed
      this.scrollFetch(10);
    }
  }

  scrollFetch(limit) {
    const { view, postsArr, fetchPosts } = this.props;
    if (view !== 'feed') return; // implement this for feed for now
    // if there is no change in the last post, user has reached the end of feed
    if (this.lastPost && this.lastPost._id === postsArr[postsArr.length - 1]._id) return;
    this.lastPost = postsArr[postsArr.length - 1];
    fetchPosts(limit, this.lastPost.createdAt, this.lastPost._id);
  }
}

export default PostIndex;