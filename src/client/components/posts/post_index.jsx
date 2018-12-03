import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PostIndexHeader from './post_index_header';
import PostShowItem from './post_show/post_show_item';
import PostFormContainer from './post_forms/post_form_container';

import { renderSpinner } from '../../util/misc_util';

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
    const { postsArr, blogs, blogId, currentUser, createFollow } = this.props;

    if (blogs[blogId] && blogs[blogId].postCount === 0) { // if blog has no posts
      return <div className='post-blank'>No posts found. </div>;
    }

    if (postsArr.length === 0) return null;

    let postIndexItems = postsArr.map(function (post) {
      let blog = blogs[post.blog];

      // render PostForm or PostShow depending on path
      // FIX: scroll to the PostForm position when editing
      return (
        <div key={post._id} >
          <Switch>
            <Route
              exact path={`/dashboard/edit/${post._id}`}
              render={(props) => <PostFormContainer post={post} blog={blog} edit={true} />} />
            <Route
              path='/dashboard'
              render={(props) => <PostShowItem post={post} blog={blog} currentUser={currentUser} createFollow={createFollow} />} />
          </Switch>
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