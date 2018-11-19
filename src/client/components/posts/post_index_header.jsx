import React from 'react';
import { Route, Switch } from 'react-router-dom';
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
        <Switch>
          <Route exact path='/dashboard/new/:type' component={PostFormContainer} />
          <Route path='/dashboard'
            render={(props) => <PostMenu {...props} currentUser={currentUser} />} />
        </Switch>
      </header>
    );
  }
}

export default PostIndexHeader;