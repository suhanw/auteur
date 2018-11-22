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
    // if (post._id === '5bf618ac9ac98f44461f63ce') {
    //   debugger
    // }
    console.log('rendering photos');

    let photos = post.media.map(function (photoUrl) {
      const key = photoUrl.split('/').pop();
      return (<img
        key={key}
        src={photoUrl}
        className='post-photo' />);
    })
    return photos;
  }
}

export default PostShowPhoto;