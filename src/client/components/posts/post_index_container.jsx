import { connect } from 'react-redux';

import PostIndex from './post_index';
import { selectPosts, selectBlogs, selectCurrentUser, selectLoadingPostIndex } from '../../selectors/selectors';
import { createFollow } from '../../actions/follow_actions';
import { fetchFeed } from '../../actions/post_actions';
import { fetchUserLikes } from '../../actions/user_actions';

const mapStateToProps = function (state, ownProps) {
  const blogs = selectBlogs(state);
  const currentUser = selectCurrentUser(state);
  const loadingPostIndex = selectLoadingPostIndex(state);

  // LOGIC FOR SELECTING THE RIGHT POSTS TO RENDER
  let postsArr;
  console.log('ownProps.view', ownProps.view);

  if (ownProps.postsArr) {
    postArr = ownProps.postsArr;// pass in posts array if used in sidebar
  } else {
    const { pathname } = ownProps.location;

    switch (pathname) {
      case pathname.includes('/dashboard/blog'): // for /dashboard/blog/blogId
        // let blogId = pathname.split('/').pop();
        // postsArr = selectPosts(state, )
        break;
      default: // any pathname that has '/dashboard', unless specified above, will render feed
        postsArr = selectPosts(state, 'feed');
        break;
    }
  }

  return {
    postsArr,
    blogs,
    currentUser,
    loadingPostIndex,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  // logic for defining what fetchPosts should fetch (feed, likes, following, etc)
  return {

    fetchFeed: () => dispatch(fetchFeed()),
    fetchUserLikes: (userId) => dispatch(fetchUserLikes(userId)),
    createFollow: (blogId) => dispatch(createFollow(blogId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostIndex);