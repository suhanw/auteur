import { connect } from 'react-redux';

import { selectCurrentUser, selectBlog } from '../../selectors/selectors';
import { fetchUserLikes } from '../../actions/user_actions';
import { fetchBlog } from '../../actions/blog_actions';
import Sidemenu from './sidemenu';

const mapStateToProps = function (state, _) {
  const currentUser = selectCurrentUser(state);
  return {
    currentUser,
    blog: selectBlog(state, currentUser.primaryBlog),
  };
};

const mapDispatchToProps = function (dispatch, _) {
  return {
    fetchBlog: (blogId) => dispatch(fetchBlog(blogId)),
    fetchUserLikes: (userId) => dispatch(fetchUserLikes(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidemenu);