import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PostIndexHeader from './post_index_header';
import PostShowItem from './post_show/post_show_item';
import PostFormContainer from './post_forms/post_form_container';

class PostIndex extends React.Component {
  constructor(props) {
    super(props);

    this.renderPostShowItems = this.renderPostShowItems.bind(this);
  }

  render() {
    const { currentUser } = this.props;
    return (
      <div className='post-index'>
        <PostIndexHeader currentUser={currentUser} />
        <ul className='post-container'>
          {this.renderPostShowItems()}
        </ul>
      </div>
    );
  }

  renderPostShowItems() {
    const { postsArr, blogs } = this.props;
    if (postsArr.length === 0 || !postsArr) {
      return (<div>Start blogging or following blogs!</div>);
    }
    let postIndexItems = postsArr.map(function (post) {
      let blog = blogs[post.blog];

      // FIX: pass in post data if it's an edit form? 
      return (
        <div key={post._id} >
          <Switch>
            <Route exact path={`/dashboard/edit/:type/${post._id}`} component={PostFormContainer} />
            <Route path='/dashboard' render={(props) => <PostShowItem post={post} blog={blog} />} />
          </Switch>
        </div>
      );
    });
    return postIndexItems;
  }

  componentDidMount() {
    const { fetchPosts } = this.props;
    fetchPosts();
  }
}

export default PostIndex;