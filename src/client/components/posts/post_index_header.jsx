import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { ProtectRoute } from '../../util/route_util';
import PostMenu from './post_menu';
import PostFormContainer from './post_forms/post_form_container';

class PostIndexHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentUser } = this.props;
    return (
      <header className='post-index-header'>
        <Route exact path='/dashboard/new/:type' component={PostFormContainer} />
        <Route exact path='/dashboard'
          render={(props) => <PostMenu {...props} currentUser={currentUser} />} />
      </header>
    );
  }
}

export default PostIndexHeader;