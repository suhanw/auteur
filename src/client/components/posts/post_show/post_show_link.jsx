import React from 'react';

class PostShowLink extends React.Component {
  constructor(props) {
    super(props);

    this.renderPostLinkImage = this.renderPostLinkImage.bind(this);
  }

  render() {
    const { post } = this.props;
    const publisher = post.linkUrl.match('(https:\/\/)([^\/]+)')[2];
    return (
      <main className='post-main'>
        <a href={post.linkUrl} target='_blank' className='post-link'>
          <small className='post-link-url'>{publisher}</small>
          {this.renderPostLinkImage()}
          <h1 className='post-link-title'>{post.title}</h1>
          <div className='post-link-desc'>{post.body}</div>
        </a>
      </main >
    )
  }

  renderPostLinkImage() {
    const { media } = this.props.post;
    if (media.length <= 0) return null;
    const postLinkImageStyle = {
      backgroundImage: `url('${media[0]}')`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      height: '200px',
      width: 'calc(100% + 40px)',
      alignSelf: 'center',
    };
    return (
      <section className='post-link-image' style={postLinkImageStyle} />
    );
  }
}

export default PostShowLink;