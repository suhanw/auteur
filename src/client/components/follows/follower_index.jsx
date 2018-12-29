import React from 'react';
import { connect } from 'react-redux';

import FollowerItem from './follower_item';
import { selectUsers, selectBlog, selectBlogs } from '../../selectors/selectors';
import { fetchFollowers, createFollow } from '../../actions/follow_actions';
import { openDrawer } from '../../actions/drawer_actions';
import { pluralize } from '../../util/misc_util';

const mapStateToProps = function (state, ownProps) {
  const { blogId } = ownProps.match.params;
  return {
    currentBlog: selectBlog(state, blogId),
    blogs: selectBlogs(state),
    users: selectUsers(state),
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    fetchFollowers: (blogId) => dispatch(fetchFollowers(blogId)),
    createFollow: (blogId) => dispatch(createFollow(blogId)),
    openDrawer: (drawer) => dispatch(openDrawer(drawer)),
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
    if (!currentBlog || !currentBlog.followers) return null; // the blog or blog.followers may not have been fetched yet

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
    const { currentBlog, users, blogs, createFollow, openDrawer } = this.props;

    let followers = currentBlog.followers.map((followerId) => {
      let follower = users[followerId];
      let followerPrimaryBlog = blogs[follower.primaryBlog];
      return <FollowerItem key={follower._id}
        follower={follower}
        followerPrimaryBlog={followerPrimaryBlog}
        createFollow={createFollow}
        openDrawer={openDrawer} />
    });
    return followers;
  }

  componentDidMount() {
    const { fetchFollowers } = this.props;
    fetchFollowers(this.props.match.params.blogId)
      .then((errAction) => {
        if (errAction) this.props.history.push('/404'); // if someone updates URl with non-existent blog id, redirect to 404
      });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match.params.blogId !== this.props.match.params.blogId) {
      const { fetchFollowers } = this.props;
      fetchFollowers(newProps.match.params.blogId)
        .then((errAction) => {
          if (errAction) this.props.history.push('/404'); // if someone updates URl with non-existent blog id, redirect to 404
        });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerIndex);