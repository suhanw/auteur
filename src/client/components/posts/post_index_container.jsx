import { connect } from 'react-redux';

import PostIndex from './post_index';
import { selectPosts, selectBlogs, selectCurrentUser } from '../../selectors/selectors';
import { fetchPosts } from '../../actions/post_actions';

const mapStateToProps = function (state, ownProps) {
  const postsArr = selectPosts(state);
  const blogs = selectBlogs(state);
  const currentUser = selectCurrentUser(state);
  return {
    postsArr,
    blogs,
    currentUser,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {

  return {
    fetchPosts: () => dispatch(fetchPosts()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostIndex);