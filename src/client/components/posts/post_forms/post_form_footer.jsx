import React from 'react';

class PostFormFooter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // FIX: grey out post button if title and body are not filled out. 
    const { closePostForm } = this.props;
    return (
      <footer className='post-footer'>
        <a className='btn btn-default btn-grey'
          onClick={closePostForm}>
          Close
        </a>
        <input type='submit'
          value='Post'
          className='btn btn-default btn-blue' />
      </footer>
    );
  }
}

export default PostFormFooter;