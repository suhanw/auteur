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
        <picture className='avatar-container'>
          <img className='avatar avatar-default' src={currentUser.avatarImageUrl} />
        </picture>
        <Route exact path='/dashboard/new/:type' component={PostFormContainer} />
        <Route exact path='/dashboard' component={PostMenu} />
      </header>
    );
  }
}

export default PostIndexHeader;