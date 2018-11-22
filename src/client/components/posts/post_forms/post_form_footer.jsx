import React from 'react';

class PostFormFooter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { closePostForm, readyToSubmit } = this.props;
    return (
      <footer className='post-footer'>
        <a className='btn btn-default btn-grey'
          onClick={closePostForm}>
          Close
        </a>
        <input type='submit'
          value='Post'
          className='btn btn-default btn-blue'
          disabled={!readyToSubmit} />
      </footer >
    );
  }
}

export default PostFormFooter;