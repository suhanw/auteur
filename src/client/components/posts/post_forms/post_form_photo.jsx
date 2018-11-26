import React from 'react';
import ContentEditable from 'react-contenteditable';
import { merge, union } from 'lodash';

import PostFormHeader from './post_form_header';
import PostFormFooter from './post_form_footer';
import { toArray } from '../../../util/misc_util';

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
    } else {
      this.state = {
        type: 'photo',
        body: '',
        media: [],
        mediaPreview: {}, // mediaPreview will be an object: {'filename': 'file_url', ...}
      };
    }

    this.renderUploadDropzone = this.renderUploadDropzone.bind(this);
    this.renderMediaPreview = this.renderMediaPreview.bind(this);
    this.removePreview = this.removePreview.bind(this);
    this.renderBodyInput = this.renderBodyInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDragAndDrop = this.handleDragAndDrop.bind(this);
    this.handleMediaFiles = this.handleMediaFiles.bind(this);
  }

  render() {
    const { blog, closePostForm } = this.props;
    const readyToSubmit = (this.state.media.length > 0) ? true : false;
    return (
      <form className='post-form' onSubmit={this.handleSubmit}>

        <PostFormHeader blog={blog} />

        <main className='post-main'>

          {this.renderMediaPreview()}

          {this.renderUploadDropzone()}

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

  renderUploadDropzone() {
    const { mediaPreview } = this.state;
    if (Object.keys(mediaPreview).length > 0) { // if user selected some images
      return (
        <div className='media-upload-dropzone'
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
              onChange={this.handleMediaFiles} />
          </label>
        </div>
      );
    }
    return (
      <div className='media-upload-dropzone'
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
            onChange={this.handleMediaFiles} />
        </label>
        <div className='media-link'>
          <i className="fas fa-globe"></i>
          <span>Add photos from web</span>
        </div>
      </div>
    );
  }

  renderMediaPreview() {
    const { media, mediaPreview } = this.state;
    // to show preview when user selects file
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
        this.handleMediaFiles(e);
        break;
    }
  }

  handleMediaFiles(e) {
    let mediaFiles;
    if (e.type === 'drop') { // to handle drag and drop
      mediaFiles = toArray(e.dataTransfer.files);
    } else {
      mediaFiles = toArray(e.target.files); // to convert FileList to Array
    }
    let media = this.state.media.slice(); // copy state
    let mediaPreview = merge({}, this.state.mediaPreview); // copy state
    let fileReaders = [];
    if (mediaFiles.length > 0) {
      const that = this;
      mediaFiles.forEach(function (file, i) {
        if (mediaPreview[file.name]) { //do nothing if a file has been previously selected
          return;
        }
        // To allow user to cumulatively append images
        media.push(file);
        fileReaders.push(new FileReader());
        fileReaders[i].readAsDataURL(file);
        fileReaders[i].onloadend = function () {
          mediaPreview[file.name] = fileReaders[i].result; // append image for preview
          that.setState({ mediaPreview });
        }
      });
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
      // let media = that.state.media.slice();
      // media = media.filter((file) => file.name !== mediaFilename);
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

  handleSubmit(e) {
    e.preventDefault();
    e.persist(); // to prevent React synthetic event from nullified, and be able to be passed into closePostForm
    const { currentUser, blog, submitAction, closePostForm } = this.props;
    let newPost = new FormData();
    for (let key in this.state) {
      if (key !== 'media' && key !== 'mediaPreview' && key !== 'filesToDelete') {
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
      if (typeof mediaFile === 'string') {
        newPost.append('oldFiles', mediaFile)
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