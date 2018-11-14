import React from 'react';

class PostShowPhoto extends React.Component {
  constructor(props) {
    super(props);

    this.renderPhotos = this.renderPhotos.bind(this);
  }

  render() {
    const { post } = this.props;
    return (
      <main className='post-main'>
        {this.renderPhotos()}
        <p className='post-body'>
          {post.body}
        </p>
      </main >
    )
  }

  renderPhotos() {
    const { post } = this.props;
    let photos = post.media.map(function (photoUrl, idx) {
      return (<img
        src={photoUrl}
        key={post._id + idx}
        className='post-photo' />);
    })
    return photos;
  }
}

export default PostShowPhoto;