import React from 'react';

class PostShowPhoto extends React.Component {
  constructor(props) {
    super(props);

    this.renderPhotos = this.renderPhotos.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }

  render() {
    return (
      <main className='post-main'>
        {this.renderPhotos()}
        {this.renderBody()}
      </main >
    )
  }

  renderPhotos() {
    const { post } = this.props;
    let photos = post.media.map(function (photoUrl) {
      return (<img
        key={photoUrl}
        src={photoUrl}
        className='post-photo' />);
    })
    return photos;
  }

  renderBody() {
    const { post } = this.props;
    if (!post.body) return null;
    return (
      <div className='post-body'
        dangerouslySetInnerHTML={{ __html: post.body }}>
      </div>
    )
  }
}

export default PostShowPhoto;