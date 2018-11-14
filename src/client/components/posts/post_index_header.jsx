import React from 'react';
import PostMenu from './post_menu';

class PostIndexHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentUser } = this.props;
    return (
      <header className='post-index-header'>
        <picture className='avatar avatar-default'>
          <img src={currentUser.avatarImageUrl} />
        </picture>
        <PostMenu />
      </header>
    );
  }
}

export default PostIndexHeader;