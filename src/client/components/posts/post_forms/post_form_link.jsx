import React from 'react';
import { merge } from 'lodash';

import PostFormHeader from './post_form_header';
import PostFormFooter from './post_form_footer';
import TagForm from '../../tags/tag_form';
import { validateUrl } from '../../../util/misc_util';

class PostFormLink extends React.Component {
  constructor(props) {
    super(props);

    // populate state for edit form (i.e., post is not null), otherwise state is blank for new form
    if (props.post) {
      this.state = merge({}, props.post);
    } else {
      this.state = {
        type: 'link',
        title: '',
        body: '',
        linkUrl: null,
        media: [],
        tags: [],
      };
    }

    this.renderUrlPreview = this.renderUrlPreview.bind(this);
    this.renderPostLinkImage = this.renderPostLinkImage.bind(this);
    this.renderUrlInput = this.renderUrlInput.bind(this);
    this.handleUrlInput = this.handleUrlInput.bind(this);
    this.removePreview = this.removePreview.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { blog, confirmDiscardPost, errorMessage } = this.props;
    const { linkUrl, title } = this.state;
    const readyToSubmit = (!linkUrl || title === '') ? false : true;
    return (
      <form className='post-form' onSubmit={this.handleSubmit}>

        <PostFormHeader blog={blog} />

        <main className='post-main'>

          {this.renderUrlPreview()}

          {this.renderUrlInput()}

          {!linkUrl ? null : <TagForm tags={this.state.tags.slice()}
            setPostTags={(tags) => this.setState({ tags: tags })} />}

        </main>

        {errorMessage}

        <PostFormFooter
          confirmDiscardPost={confirmDiscardPost}
          readyToSubmit={readyToSubmit} />

      </form>
    );
  }

  renderUrlInput() {
    const { linkUrl } = this.state;
    if (linkUrl) return null;
    return (
      <div className='media-input'>
        <input className='media-link-input'
          onChange={this.handleUrlInput}
          autoFocus={true}
          type='text'
          placeholder='Type or paste a URL (please include https://)' />
      </div>
    );
  }

  handleUrlInput(e) {
    e.persist();
    let linkUrl = e.target.value;
    const that = this;
    validateUrl(linkUrl, 'link', (linkMeta) => {
      if (!linkMeta) return; // do nothing if url is not valid or returns a 404
      let newState = {};
      newState.linkUrl = linkUrl;
      newState.title = linkMeta.linkTitle || linkMeta.linkMetaOgTitle || '';
      newState.body = linkMeta.linkMetaDesc || linkMeta.linkMetaOgDesc || '';
      newState.media = (linkMeta.linkMetaImage) ? [linkMeta.linkMetaImage] : [];
      that.setState(newState);
      e.target.value = null;
    });
  }

  renderUrlPreview() { // to show preview when user enters URL
    const { title, body, linkUrl } = this.state;
    if (!linkUrl) return null;
    let linkPreview = (
      <article className='post-link'>
        <section className='post-link-url'>
          {linkUrl}
        </section>

        <span className='remove-icon'>
          <i className="fas fa-times-circle"
            onClick={this.removePreview}></i>
        </span>

        {this.renderPostLinkImage()}

        <input className='post-link-title'
          onChange={this.handleChange('title')}
          type='text'
          value={title}
          placeholder='Enter a title'
          autoFocus={true} />

        <textarea className='post-link-desc'
          onChange={this.handleChange('body')}
          type='text'
          value={body}
          placeholder='Enter a summary'>
        </textarea>


      </article >

    );
    return linkPreview;
  }

  renderPostLinkImage() {
    const { media } = this.state;
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

  removePreview(e) {
    let newState = {
      type: 'link',
      title: '',
      body: '',
      linkUrl: null,
      media: [],
      urlPreview: {},
    };
    this.setState(newState);
  }


  handleChange(inputField) {
    const that = this;
    return function (e) {
      let newState = {};
      newState[inputField] = e.target.value;
      that.setState(newState);
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    e.persist(); // to prevent React synthetic event from nullified, and be able to be passed into closePostForm
    const { currentUser, blog, submitAction, closePostForm } = this.props;
    let newPost = new FormData();
    for (let key in this.state) {
      if (key === 'media' && this.state[key].length <= 0) {
        continue; // appending an empty array to FormData will instead add an empty string, so do nothing
      }
      newPost.append(key, this.state[key]);
    }
    if (!this.state._id) { // for new posts, state does not include author and blog
      newPost.append('author', currentUser._id);
      newPost.append('blog', blog._id);
    }
    submitAction(newPost).then(
      (errAction) => {
        if (errAction) return; // if a post error is received, do nothing
        closePostForm(e); // otherwise, close form after posting
      }
    );
  }
}

export default PostFormLink;