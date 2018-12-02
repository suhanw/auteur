import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PostIndexHeader from './post_index_header';
import PostShowItem from './post_show/post_show_item';
import PostFormContainer from './post_forms/post_form_container';

import { renderSpinner } from '../../util/misc_util';

class PostIndex extends React.Component {
  constructor(props) {
    super(props);

    this.renderPostShowItems = this.renderPostShowItems.bind(this);
  }

  render() {
    // FIX: add error handlers!!
    const { currentUser, loadingPostIndex, view, blogs, blogId } = this.props;

    // redirect to dashboard if user is not following any blogs or doesn't have any likes
    if (view === 'following' && currentUser.following.length === 0
      || view === 'likes' && currentUser.likeCount === 0) {
      // FIX: show some kind of message
      return <Redirect to='/dashboard' />
    }

    let spinnerClass = (loadingPostIndex) ? 'loading-post-index' : null;

    return (
      <div className='post-index'>
        <PostIndexHeader currentUser={currentUser} />
        <ul className='post-container'>
          {this.renderPostShowItems()}
        </ul>
        {renderSpinner(spinnerClass)}
      </div>
    );
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
    const { view, fetchPosts, fetchUserLikes, currentUser } = this.props;
    if (view !== 'likes') fetchUserLikes(currentUser._id); // to avoid calling fetchUserLikes twice
    fetchPosts();
  }

  componentWillReceiveProps(newProps) {
    // to call fetch when view changes
    const oldView = this.props.view;
    const newView = newProps.view;
    const { fetchPosts, fetchUserLikes, currentUser } = newProps;
    // debugger
    const oldBlogId = this.props.match.params.blogId;
    const newBlogId = newProps.match.params.blogId;
    if (newView !== oldView || oldBlogId !== newBlogId) {
      if (newView !== 'likes') fetchUserLikes(currentUser._id); // to avoid calling fetchUserLikes twice
      fetchPosts();
    }
  }
}

export default PostIndex;