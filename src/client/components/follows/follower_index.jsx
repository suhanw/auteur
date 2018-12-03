import React from 'react';
import { connect } from 'react-redux';

import FollowerItem from './follower_item';
import { selectUsers, selectCurrentUser, selectBlog, selectBlogs } from '../../selectors/selectors';
import { fetchFollowers, createFollow } from '../../actions/follow_actions';
import { pluralize } from '../../util/misc_util';

const mapStateToProps = function (state, ownProps) {
  const { blogId } = ownProps.match.params;
  const currentBlog = selectBlog(state, blogId);
  const currentUser = selectCurrentUser(state);
  const users = selectUsers(state);
  const blogs = selectBlogs(state);
  return {
    currentBlog,
    currentUser,
    blogs,
    users,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  const { blogId } = ownProps.match.params;
  return {
    fetchFollowers: () => dispatch(fetchFollowers(blogId)),
    createFollow: (blogId) => dispatch(createFollow(blogId)),
  };
};

class FollowerIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      followPopover: false,
    };

    this.renderFollowers = this.renderFollowers.bind(this);
  }

  render() {
    const { currentBlog } = this.props;
    if (!currentBlog || !currentBlog.followers) { // the blog or blog.followers may not have been fetched yet
      return null;
    }

    return (
      <div className='followers'>
        <header className='followers-header'>
          {currentBlog.followers.length} {pluralize(currentBlog.followers.length, 'person', 'people')} {pluralize(currentBlog.followers.length, 'follows', 'follow')} this blog
        </header>
        <ul className='followers-list'>
          {this.renderFollowers()}
        </ul>
      </div>
    );
  }

  renderFollowers() {
    const { currentUser, currentBlog, users, blogs, createFollow } = this.props;

    let followers = currentBlog.followers.map((followerId) => {
      let follower = users[followerId];
      let followerPrimaryBlog = blogs[follower.primaryBlog];
      return <FollowerItem key={follower._id}
        follower={follower}
        followerPrimaryBlog={followerPrimaryBlog}
        currentUser={currentUser}
        createFollow={createFollow} />
    });
    return followers;
  }


  componentDidMount() {
    const { fetchFollowers } = this.props;
    fetchFollowers();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerIndex);