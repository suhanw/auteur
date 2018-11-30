import React from 'react';
import ContentEditable from 'react-contenteditable';
import { merge, union } from 'lodash';

import PostFormHeader from './post_form_header';
import PostFormFooter from './post_form_footer';
import { toArray, validateUrl } from '../../../util/misc_util';

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
        urlPreview: {},
      };
    }

    // this.renderMediaInput = this.renderMediaInput.bind(this);
    this.renderUrlPreview = this.renderUrlPreview.bind(this);
    this.renderPostLinkImage = this.renderPostLinkImage.bind(this);
    // this.renderSmallUploadDropzone = this.renderSmallUploadDropzone.bind(this);
    this.renderUrlInput = this.renderUrlInput.bind(this);
    this.handleUrlInput = this.handleUrlInput.bind(this);
    this.removePreview = this.removePreview.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleDragAndDrop = this.handleDragAndDrop.bind(this);
    // this.handleMediaInput = this.handleMediaInput.bind(this);
  }

  render() {
    const { blog, closePostForm } = this.props;
    const readyToSubmit = (this.state.media.length > 0) ? true : false;
    return (
      <form className='post-form' onSubmit={this.handleSubmit}>

        <PostFormHeader blog={blog} />

        <main className='post-main'>

          {this.renderUrlPreview()}

          {this.renderUrlInput()}

        </main>

        <PostFormFooter
          closePostForm={closePostForm}
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
          placeholder='Type or paste a URL.' />
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
      newState.title = linkMeta.linkTitle || linkMeta.linkMetaOgTitle;
      newState.body = linkMeta.linkMetaDesc || linkMeta.linkMetaOgDesc;
      newState.media = (linkMeta.linkMetaImage) ? [linkMeta.linkMetaImage] : [];
      // debugger
      that.setState(newState, () => console.log(that.state));
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
          placeholder='Enter a title' />

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
  // renderMediaInput() {
  //   const { mediaPreview, urlInput } = this.state;

  //   if (Object.keys(mediaPreview).length > 0) { // if user already selected some images
  //     if (urlInput) {
  //       // FIX: when editting a post with media link, the url input does not render
  //       return this.renderSmallUrlInput();
  //     } else {
  //       return this.renderSmallUploadDropzone();
  //     }
  //   } else if (urlInput) {
  //     return this.renderUrlInput();
  //   }

  //   return (
  //     <div className='media-input'
  //       onDragEnter={this.handleDragAndDrop}
  //       onDragLeave={this.handleDragAndDrop}
  //       onDragOver={this.handleDragAndDrop}
  //       onDrop={this.handleDragAndDrop}>

  //       <label htmlFor='file' className='media-upload'>
  //         <i className="fas fa-camera"></i>
  //         <span>Upload photos</span>
  //         <input
  //           type='file'
  //           className='inputfile'
  //           id='file'
  //           accept='image/*'
  //           multiple={true}
  //           onChange={this.handleMediaInput} />
  //       </label>
  //       <div className='media-link'
  //         onClick={() => this.setState({ urlInput: true })}>
  //         <i className="fas fa-globe"></i>
  //         <span>Add photos from web</span>
  //       </div>

  //     </div>
  //   );
  // }


  // renderSmallUrlInput() {
  //   return (
  //     <div className='media-input'>
  //       <input className='media-link-input-small'
  //         onChange={this.handleMediaInput}
  //         autoFocus={true}
  //         type='text'
  //         placeholder='Add another URL.' />
  //     </div>
  //   )
  // }

  // renderSmallUploadDropzone() {
  //   return (
  //     <div className='media-input'
  //       onDragEnter={this.handleDragAndDrop}
  //       onDragLeave={this.handleDragAndDrop}
  //       onDragOver={this.handleDragAndDrop}
  //       onDrop={this.handleDragAndDrop}>
  //       <label htmlFor='file' className='media-upload-small'>
  //         <i className="fas fa-camera"></i>
  //         <span>Add another</span>
  //         <input
  //           type='file'
  //           className='inputfile'
  //           id='file'
  //           accept='image/*'
  //           multiple={true}
  //           onChange={this.handleMediaInput} />
  //       </label>
  //     </div>
  //   );
  // }



  // handleDragAndDrop(e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   e.persist();
  //   switch (e.type) {
  //     case 'dragenter':
  //       e.currentTarget.classList.add('active');
  //       break;
  //     case 'dragover':
  //       e.currentTarget.classList.add('active');
  //       break;
  //     case 'dragleave':
  //       e.currentTarget.classList.remove('active');
  //       break;
  //     case 'drop':
  //       e.currentTarget.classList.remove('active');
  //       this.handleMediaInput(e);
  //       break;
  //   }
  // }

  // handleMediaInput(e) {
  //   let mediaFiles = [];
  //   let mediaUrl = null;
  //   if (e.type === 'drop') { // to handle drag and drop
  //     mediaFiles = toArray(e.dataTransfer.files);
  //   } else if (e.target.files) { // to handle the regular upload feature
  //     mediaFiles = toArray(e.target.files); // to convert FileList to Array
  //   } else { // for URL input
  //     mediaUrl = e.target.value;
  //     e.persist(); // to enable resetting text field to blank in the validateUrl callback
  //   }
  //   let media = this.state.media.slice(); // copy state
  //   let mediaPreview = merge({}, this.state.mediaPreview); // copy state
  //   let fileReaders = [];
  //   // FOR MEDIA UPLOAD
  //   if (mediaFiles.length > 0) {
  //     const that = this;
  //     mediaFiles.forEach(function (file, i) {
  //       if (mediaPreview[file.name]) return;  //do nothing if a file has been previously selected
  //       // Allow user to cumulatively append images
  //       media.push(file);
  //       fileReaders.push(new FileReader());
  //       fileReaders[i].readAsDataURL(file);
  //       fileReaders[i].onloadend = function () {
  //         mediaPreview[file.name] = fileReaders[i].result; // append image for preview
  //         that.setState({ mediaPreview });
  //       }
  //     });
  //     that.setState({ media });
  //   }
  //   // FOR MEDIA LINK 
  //   if (mediaUrl) {
  //     const that = this;
  //     if (mediaPreview[mediaUrl]) return; //do nothing if a file has been previously selected
  //     validateMediaUrl(mediaUrl, 'image', (response) => {
  //       if (!response) return; // do nothing if mediaUrl is not valid or returns a 404
  //       media.push(mediaUrl);
  //       mediaPreview[mediaUrl] = mediaUrl;
  //       e.target.value = null;
  //       that.setState({ mediaPreview, media });
  //     });
  //   }
  //   // FIX: add loader for preview images
  // }





  handleSubmit(e) {
    e.preventDefault();
    e.persist(); // to prevent React synthetic event from nullified, and be able to be passed into closePostForm
    const { currentUser, blog, submitAction, closePostForm } = this.props;
    let newPost = new FormData();
    for (let key in this.state) {
      newPost.append(key, this.state[key]);
    }
    if (!this.state._id) { // for new posts, state does not include author and blog
      newPost.append('author', currentUser._id);
      newPost.append('blog', blog._id);
    }
    //   let newPost = new FormData();
    //   for (let key in this.state) {
    //     if (key !== 'media' &&
    //       key !== 'mediaPreview' &&
    //       key !== 'filesToDelete' &&
    //       key !== 'urlInput') { // this key is for rendering purposes and doesn't have to be submitted
    //       newPost.append(key, this.state[key]);
    //     }
    //   }
    //   // for new posts, state does not include author and blog
    //   if (!this.state._id) {
    //     newPost.append('author', currentUser._id);
    //     newPost.append('blog', blog._id);
    //   }
    //   // append photos to form data
    //   this.state.media.forEach(function (mediaFile) {
    //     if (typeof mediaFile === 'string') { // files that have already been uploaded are persisted as string URLs
    //       newPost.append('urls', mediaFile)
    //     } else {
    //       newPost.append('newFiles', mediaFile, mediaFile.name);
    //     }
    //   });
    //   if (this.state.filesToDelete) { // if there were files to delete
    //     this.state.filesToDelete.forEach(function (file) { // appending file one by one will keep the array structure in FormData
    //       newPost.append('filesToDelete', file);
    //     })
    //   }
    // invoke AJAX to create new post or edit post
    submitAction(newPost).then(
      () => closePostForm(e) // close form after posting
    );
  }
}

export default PostFormLink;