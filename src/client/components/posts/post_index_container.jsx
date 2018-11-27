import { connect } from 'react-redux';

import PostIndex from './post_index';
import { selectPosts, selectBlogs, selectCurrentUser, selectLoadingPostIndex } from '../../selectors/selectors';
import { fetchFeed } from '../../actions/post_actions';
import { fetchUserLikes } from '../../actions/user_actions';

const mapStateToProps = function (state, ownProps) {
  const postsArr = selectPosts(state);
  const blogs = selectBlogs(state);
  const currentUser = selectCurrentUser(state);
  const loadingPostIndex = selectLoadingPostIndex(state);
  return {
    postsArr,
    blogs,
    currentUser,
    loadingPostIndex,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    fetchFeed: () => dispatch(fetchFeed()),
    fetchUserLikes: (userId) => dispatch(fetchUserLikes(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostIndex);