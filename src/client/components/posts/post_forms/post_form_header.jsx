import React from 'react';

class PostFormHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { blog } = this.props;
    return (
      <header className='post-header'>
        {!blog ? 'Loading blog...' : blog.name}
      </header>
    );
  }
}

export default PostFormHeader;