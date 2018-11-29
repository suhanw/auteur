import React from 'react';
import ContentEditable from 'react-contenteditable';
import { merge, union } from 'lodash';

import PostFormHeader from './post_form_header';
import PostFormFooter from './post_form_footer';
import { toArray, validateMediaUrl } from '../../../util/misc_util';

class PostFormPhoto extends React.Component {
  constructor(props) {
    super(props);

    // populate state for edit form (i.e., post is not null), otherwise state is blank for new form
    if (props.post) {
      this.state = merge({}, props.post);
      let mediaPreview = {};
      props.post.media.forEach(function (mediaURL) {
        let mediaFilename = mediaURL.split('/').pop();
        mediaPreview[mediaFilename] = mediaURL;
      });
      this.state.mediaPreview = mediaPreview;
      this.state.urlInput = false;
    } else {
      this.state = {
        type: 'photo',
        body: '',
        media: [],
        mediaPreview: {}, // mediaPreview will be an object: {'filename': 'file_url', ...}
        urlInput: false,
      };
    }

    this.renderMediaInput = this.renderMediaInput.bind(this);
    this.renderMediaPreview = this.renderMediaPreview.bind(this);
    this.renderSmallUploadDropzone = this.renderSmallUploadDropzone.bind(this);
    this.renderUrlInput = this.renderUrlInput.bind(this);
    this.removePreview = this.removePreview.bind(this);
    this.renderBodyInput = this.renderBodyInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDragAndDrop = this.handleDragAndDrop.bind(this);
    this.handleMediaInput = this.handleMediaInput.bind(this);
  }

  render() {
    const { blog, closePostForm } = this.props;
    const readyToSubmit = (this.state.media.length > 0) ? true : false;
    return (
      <form className='post-form' onSubmit={this.handleSubmit}>

        <PostFormHeader blog={blog} />

        <main className='post-main'>

          {this.renderMediaPreview()}

          {this.renderMediaInput()}

          {this.renderBodyInput()}

        </main>

        <PostFormFooter
          closePostForm={closePostForm}
          readyToSubmit={readyToSubmit} />

      </form>
    );
  }

  renderBodyInput() {
    const { mediaPreview, body } = this.state;
    if (Object.keys(mediaPreview).length > 0) { // only render when images have been selected
      return (
        <ContentEditable className='post-body'
          html={body}
          disabled={false}
          onChange={this.handleChange('body')}
          placeholder='Add a caption, if you like.'
          tagName='div' />
      );
    }
    return null;
  }

  renderMediaInput() {
    const { mediaPreview, urlInput } = this.state;
    if (urlInput) return this.renderUrlInput();

    if (Object.keys(mediaPreview).length > 0) { // if user already selected some images
      return this.renderSmallUploadDropzone();
    }

    return (
      <div className='media-input'
        onDragEnter={this.handleDragAndDrop}
        onDragLeave={this.handleDragAndDrop}
        onDragOver={this.handleDragAndDrop}
        onDrop={this.handleDragAndDrop}>

        <label htmlFor='file' className='media-upload'>
          <i className="fas fa-camera"></i>
          <span>Upload photos</span>
          <input
            type='file'
            className='inputfile'
            id='file'
            accept='image/*'
            multiple={true}
            onChange={this.handleMediaInput} />
        </label>
        <div className='media-link'
          onClick={() => this.setState({ urlInput: true })}>
          <i className="fas fa-globe"></i>
          <span>Add photos from web</span>
        </div>

      </div>
    );
  }

  renderUrlInput() {
    return (
      <div className='media-input'>
        <input className='media-link-input'
          onChange={this.handleMediaInput}
          autoFocus={true}
          type='text'
          placeholder='Type or paste a URL.' />
        <span className='remove-icon'>
          <i className="fas fa-times-circle"
            onClick={() => this.setState({ urlInput: false })}></i>
        </span>
      </div>
    );
  }

  renderSmallUploadDropzone() {
    return (
      <div className='media-input'
        onDragEnter={this.handleDragAndDrop}
        onDragLeave={this.handleDragAndDrop}
        onDragOver={this.handleDragAndDrop}
        onDrop={this.handleDragAndDrop}>
        <label htmlFor='file' className='media-upload-small'>
          <i className="fas fa-camera"></i>
          <span>Add another</span>
          <input
            type='file'
            className='inputfile'
            id='file'
            accept='image/*'
            multiple={true}
            onChange={this.handleMediaInput} />
        </label>
      </div>
    );
  }

  handleChange(inputField) {
    const that = this;
    return function (e) {
      let newState = {};
      newState[inputField] = e.target.value;
      that.setState(newState);
    };
  }

  handleDragAndDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.persist();
    switch (e.type) {
      case 'dragenter':
        e.currentTarget.classList.add('active');
        break;
      case 'dragover':
        e.currentTarget.classList.add('active');
        break;
      case 'dragleave':
        e.currentTarget.classList.remove('active');
        break;
      case 'drop':
        e.currentTarget.classList.remove('active');
        this.handleMediaInput(e);
        break;
    }
  }

  handleMediaInput(e) {
    let mediaFiles = [];
    let mediaUrls = [];
    if (e.type === 'drop') { // to handle drag and drop
      mediaFiles = toArray(e.dataTransfer.files);
    } else if (e.target.files) { // to handle the regular upload feature
      mediaFiles = toArray(e.target.files); // to convert FileList to Array
    } else { // for URL input
      mediaUrls.push(e.target.value);
    }
    let media = this.state.media.slice(); // copy state
    let mediaPreview = merge({}, this.state.mediaPreview); // copy state
    let fileReaders = [];
    // FOR MEDIA UPLOAD
    if (mediaFiles.length > 0) {
      const that = this;
      mediaFiles.forEach(function (file, i) {
        if (mediaPreview[file.name]) return;  //do nothing if a file has been previously selected
        // Allow user to cumulatively append images
        media.push(file);
        fileReaders.push(new FileReader());
        fileReaders[i].readAsDataURL(file);
        fileReaders[i].onloadend = function () {
          mediaPreview[file.name] = fileReaders[i].result; // append image for preview
          that.setState({ mediaPreview });
        }
      });
    }
    // FOR MEDIA LINK 
    if (mediaUrls.length > 0) {
      const that = this;
      mediaUrls.forEach(function (url, i) {
        // if URL doesn't exist, do nothing
        if (mediaPreview[url]) return;
        validateMediaUrl(url, 'image', (response) => {
          if (!response) return; // if response is null, do nothing
          console.log(response);
          media.push(url);
          mediaPreview[url] = url;
          that.setState({ mediaPreview });
        });
      })
    }
    this.setState({ media });
    // FIX: add loader for preview images
  }

  removePreview(mediaFilename) {
    const that = this;
    return function (e) {
      e.preventDefault();
      let mediaPreview = merge({}, that.state.mediaPreview);
      const { media } = that.state;
      let newMedia = []; // potentially new files to be uploaded to AWS
      let filesToDelete = union([], that.state.filesToDelete);
      media.forEach(function (file) {
        if (typeof file === 'string') { // files already on AWS persisted as URL strings
          if (file === mediaPreview[mediaFilename]) {
            filesToDelete.push(file);
          } else {
            newMedia.push(file);
          }
        } else if (file.name !== mediaFilename) {
          newMedia.push(file);
        }
      });
      delete mediaPreview[mediaFilename];
      that.setState({ media: newMedia, filesToDelete, mediaPreview });
    };
  }

  renderMediaPreview() {
    // to show preview when user selects file
    const { media, mediaPreview } = this.state;
    let mediaPreviewImgs = [];
    for (let mediaFilename in mediaPreview) {
      mediaPreviewImgs.push(
        <div key={mediaFilename} className='post-photo'>
          <span className='remove-icon'>
            <i className="fas fa-minus-circle"
              onClick={this.removePreview(mediaFilename)}></i>
          </span>
          <img src={mediaPreview[mediaFilename]} />
        </div>
      );
    }
    return mediaPreviewImgs;
  }

  handleSubmit(e) {
    e.preventDefault();
    e.persist(); // to prevent React synthetic event from nullified, and be able to be passed into closePostForm
    const { currentUser, blog, submitAction, closePostForm } = this.props;
    let newPost = new FormData();
    for (let key in this.state) {
      if (key !== 'media' &&
        key !== 'mediaPreview' &&
        key !== 'filesToDelete' &&
        key !== 'urlInput') { // this key is for rendering purposes and doesn't have to be submitted
        newPost.append(key, this.state[key]);
      }
    }
    // for new posts, state does not include author and blog
    if (!this.state._id) {
      newPost.append('author', currentUser._id);
      newPost.append('blog', blog._id);
    }
    // append photos to form data
    this.state.media.forEach(function (mediaFile) {
      if (typeof mediaFile === 'string') { // files that have already been uploaded are persisted as string
        newPost.append('urls', mediaFile)
      } else {
        newPost.append('newFiles', mediaFile, mediaFile.name);
      }
    });
    if (this.state.filesToDelete) { // if there were files to delete
      this.state.filesToDelete.forEach(function (file) { // appending file one by one will keep the array structure in FormData
        newPost.append('filesToDelete', file);
      })
    }
    // invoke AJAX to create new post or edit post
    submitAction(newPost).then(
      () => closePostForm(e) // close form after posting
    );
  }
}

export default PostFormPhoto;