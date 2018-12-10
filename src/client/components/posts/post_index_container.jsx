import { connect } from 'react-redux';

import PostIndex from './post_index';
import { selectPosts, selectBlogs, selectCurrentUser, selectLoadingPostIndex } from '../../selectors/selectors';
import { createFollow } from '../../actions/follow_actions';
import { fetchFeed, fetchPostsByBlog } from '../../actions/post_actions';
import { fetchUserFollowing, fetchUserLikes } from '../../actions/user_actions';
import { openDrawer } from '../../actions/drawer_actions';

const mapStateToProps = function (state, ownProps) {
  const blogs = selectBlogs(state);
  const currentUser = selectCurrentUser(state);
  const loadingPostIndex = selectLoadingPostIndex(state);

  // LOGIC FOR SELECTING THE RIGHT POSTS TO RENDER
  const { view } = ownProps;
  let blogId;
  if (view === 'currentBlog') blogId = ownProps.match.params.blogId;
  else if (view === 'blogDrawer') blogId = ownProps.blogId;
  let postsArr = [];

  postsArr = selectPosts(state, view, blogId);

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
  const { view } = ownProps;
  let userId;
  let blogId;
  if (view === 'currentBlog') blogId = ownProps.match.params.blogId;
  else if (view === 'blogDrawer') blogId = ownProps.blogId;
  else if (view === 'likes' || view === 'following') userId = ownProps.match.params.userId;

  const fetchActions = {
    'feed': (limit, lastPostDate, lastPostId) => fetchFeed(limit, lastPostDate, lastPostId),
    'currentBlog': () => fetchPostsByBlog(blogId),
    'blogDrawer': () => fetchPostsByBlog(blogId),
    'likes': () => fetchUserLikes(userId, { populate: true }),
    'following': () => fetchUserFollowing(userId),
  }
  let fetchPosts = fetchActions[view];
  return {
    fetchPosts: (limit, lastPostDate, lastPostId) => dispatch(fetchPosts(limit, lastPostDate, lastPostId)),
    fetchUserLikes: (userId) => dispatch(fetchUserLikes(userId)),
    createFollow: (blogId) => dispatch(createFollow(blogId)),
    openDrawer: (drawer) => dispatch(openDrawer(drawer)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostIndex);