import React from 'react';

import PostIndexHeader from './post_index_header';
import PostShowItem from '../post_show/post_show_item';

import { PostSpinner } from '../../spinners/spinners';

class PostIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backToTopActive: false,
    };

    this.lastPost;

    this.renderPostIndexHeader = this.renderPostIndexHeader.bind(this);
    this.renderPostShowItems = this.renderPostShowItems.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.scrollFetch = this.scrollFetch.bind(this);
    this.renderBackToTop = this.renderBackToTop.bind(this);
  }

  render() {
    // TODO: add error handlers!!
    const { loadingPostIndex } = this.props;

    return (
      <div className='post-index'>
        {this.renderPostIndexHeader()}
        <ul className='post-container'>
          {this.renderPostShowItems()}
        </ul>
        {loadingPostIndex && <PostSpinner spinnerClass='loading-post-index' />}
        {this.renderBackToTop()}
      </div>
    );
  }

  componentDidMount() {
    const { fetchPosts, fetchUserLikes, currentUser, view } = this.props;
    if (!currentUser.likedPosts) fetchUserLikes(currentUser._id); // to fetch only when it's not populated
    fetchPosts()
      .then((errAction) => {
        if (errAction) this.props.history.push('/404'); // if someone updates URl with non-existent blog id, redirect to 404
      });

    const dashboard = document.querySelector('div.dashboard');
    // event only fires on element that has overflow: scroll
    if (dashboard) dashboard.addEventListener('scroll', this.handleScroll); // dashboard is null in BlogDrawer
  }

  componentWillReceiveProps(newProps) {
    const oldView = this.props.view;
    const newView = newProps.view;
    const { fetchPosts, fetchUserLikes, currentUser } = newProps;
    const oldBlogId = (this.props.match) ? this.props.match.params.blogId : 0;
    const newBlogId = (newProps.match) ? newProps.match.params.blogId : 0;
    if (newView !== oldView || oldBlogId !== newBlogId) { // to fetch posts when view changes
      document.querySelector('div.dashboard').scrollTo(0, 0); // scroll to top when view changes
      if (!currentUser.likedPosts) fetchUserLikes(currentUser._id); // to fetch current user likes only when it's not populated
      fetchPosts()
        .then((errAction) => {
          if (errAction) this.props.history.push('/404'); // if someone updates URl with non-existent blog id, redirect to dashboard
        });
    }
  }

  componentWillUnmount() {
    const dashboard = document.querySelector('div.dashboard');
    if (dashboard) dashboard.removeEventListener('scroll', this.handleScroll);
  }

  renderBackToTop() {
    const dashboard = document.querySelector('div.dashboard');
    if (!this.state.backToTopActive) return null;
    return (
      <i className="back-to-top fas fa-arrow-up"
        onClick={() => dashboard.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })}></i>
    );
  }

  renderPostIndexHeader() {
    const { view } = this.props;
    if (view === 'likes' ||
      view === 'following' ||
      view === 'blogDrawer') return null;
    return (
      <PostIndexHeader />
    )
  }

  renderPostShowItems() {
    const {
      view,
      postsArr,
      blogId,
      blogs,
      currentUser,
      createFollow,
      openDrawer,
    } = this.props;

    if (blogs[blogId] && blogs[blogId].postCount === 0) { // if at the blog view page and blog has no posts
      return <div className='post-blank'>
        <img className='not-found-icon' src='images/notFound.png' />
        No posts found.
      </div>;
    } else if (view === 'likes' && currentUser.likeCount === 0 || // if at the likes page and no lkes
      view === 'following' && currentUser.following.length === 0) { // if at the following page and user doesn't follow any blogs
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
            view={view}
            post={post}
            blog={blog}
            createFollow={createFollow}
            openDrawer={openDrawer} />
        </div>
      );
    });
    return postIndexItems;
  }

  handleScroll(e) {
    const scrollHeight = e.currentTarget.scrollHeight; // full length of the feed currently rendered
    const clientHeight = e.currentTarget.clientHeight; // visible height of feed
    const scrollTop = e.currentTarget.scrollTop; // distance from the top measured from top of window viewport
    this.setState({ backToTopActive: (scrollTop > 1000) }); // render back to top arrow when user scrolls down
    if (scrollTop + clientHeight >= scrollHeight - 1000) { // when user hits bottom of feed
      this.scrollFetch(10);
    }
  }

  scrollFetch(limit) {
    const { view, postsArr, fetchPosts } = this.props;
    if (view !== 'feed') return; // implement this for feed for now
    if (this.lastPost && this.lastPost._id === postsArr[postsArr.length - 1]._id) {
      return; // if there is no change in the last post, user has reached the end of feed
    }
    this.lastPost = postsArr[postsArr.length - 1];
    fetchPosts(limit, this.lastPost.createdAt, this.lastPost._id);
  }
}

export default PostIndex;