import { connect } from 'react-redux';

import PostIndex from './post_index';
import { selectPosts, selectBlogs, selectCurrentUser, selectLoadingPostIndex } from '../../selectors/selectors';
import { createFollow, fetchFollowers } from '../../actions/follow_actions';
import { fetchFeed, fetchPostsByBlog } from '../../actions/post_actions';
import { fetchUserFollowing, fetchUserLikes } from '../../actions/user_actions';

const mapStateToProps = function (state, ownProps) {
  const blogs = selectBlogs(state);
  const currentUser = selectCurrentUser(state);
  const loadingPostIndex = selectLoadingPostIndex(state);

  // LOGIC FOR SELECTING THE RIGHT POSTS TO RENDER
  let { view } = ownProps;
  let { blogId } = ownProps.match.params;
  let postsArr = [];

  if (ownProps.postsArr) { // pass in posts array if used in BlogShow component
    postArr = ownProps.postsArr;
  } else {
    postsArr = selectPosts(state, view, blogId);
  }

  return {
    view,
    postsArr,
    blogs,
    currentUser,
    loadingPostIndex,
    blogId,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  // logic for defining what fetchPosts should fetch (feed, likes, following, etc)
  let { view } = ownProps;
  let { userId, blogId } = ownProps.match.params;
  const fetchActions = {
    'feed': () => fetchFeed(),
    'blogId': () => fetchPostsByBlog(blogId),
    'likes': () => fetchUserLikes(userId, { populate: true }),
    'following': () => fetchUserFollowing(userId),
  }
  let fetchPosts = fetchActions[view];
  return {
    fetchPosts: () => dispatch(fetchPosts()),
    fetchUserLikes: (userId) => dispatch(fetchUserLikes(userId)),
    createFollow: (blogId) => dispatch(createFollow(blogId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostIndex);