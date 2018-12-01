import { connect } from 'react-redux';

import PostIndex from './post_index';
import { selectPosts, selectBlogs, selectCurrentUser, selectLoadingPostIndex } from '../../selectors/selectors';
import { createFollow, fetchFollowers } from '../../actions/follow_actions';
import { fetchFeed } from '../../actions/post_actions';
import { fetchUserFollowing, fetchUserLikes } from '../../actions/user_actions';

const mapStateToProps = function (state, ownProps) {
  const blogs = selectBlogs(state);
  const currentUser = selectCurrentUser(state);
  const loadingPostIndex = selectLoadingPostIndex(state);

  // LOGIC FOR SELECTING THE RIGHT POSTS TO RENDER
  let { view } = ownProps;
  let postsArr = [];
  console.log('ownProps.view', ownProps.view);

  if (ownProps.postsArr) {// pass in posts array if used in sidebar
    postArr = ownProps.postsArr;
  } else {
    postsArr = selectPosts(state, view)
    console.log('postsArr', postsArr);
  }

  return {
    view,
    postsArr,
    blogs,
    currentUser,
    loadingPostIndex,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  // logic for defining what fetchPosts should fetch (feed, likes, following, etc)
  let { view } = ownProps;
  const fetchActions = {
    'feed': fetchFeed,
    'following': fetchUserFollowing,
    // 'likes': (userId) => fetchUserLikes(userId, { populate: true }),
    // 'blogId': fetchPosts,
  }
  let fetchPosts = fetchActions[view];
  return {
    fetchPosts: (userId) => dispatch(fetchPosts(userId)),
    fetchUserLikes: (userId) => dispatch(fetchUserLikes(userId)),
    createFollow: (blogId) => dispatch(createFollow(blogId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostIndex);