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
        <div className='post-body'
          dangerouslySetInnerHTML={{ __html: post.body }}>
        </div>
      </main >
    )
  }

  renderPhotos() {
    const { post } = this.props;
    // debugger

    let photos = post.media.map(function (photoUrl, idx) {
      return (<img
        key={photoUrl}
        src={photoUrl}
        className='post-photo' />);
    })
    return photos;
  }
}

export default PostShowPhoto;