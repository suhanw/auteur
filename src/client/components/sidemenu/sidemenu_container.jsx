import { connect } from 'react-redux';

import { selectCurrentUser, selectBlog } from '../../selectors/selectors';
import { fetchUserLikes } from '../../actions/user_actions';
import { fetchBlog } from '../../actions/blog_actions';
import Sidemenu from './sidemenu';

const mapStateToProps = function (state, ownProps) {
  const currentUser = selectCurrentUser(state);
  const blog = selectBlog(state, currentUser.primaryBlog);
  return {
    currentUser,
    blog,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    fetchBlog: (blogId) => dispatch(fetchBlog(blogId)),
    fetchUserLikes: (userId) => dispatch(fetchUserLikes(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidemenu);