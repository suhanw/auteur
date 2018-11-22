const lodash = require('lodash');

let mediaUpload = {};

// SET UP AWS FILE UPLOAD=====================
const AWS = require('aws-sdk');

let s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  Bucket: process.env.AWS_BUCKET,
});

let bucket = process.env.AWS_BUCKET;
// SET UP AWS FILE UPLOAD=====================

mediaUpload.uploadFiles = function (files, newPost, handleSuccess, handleFailure) {
  if (newPost.type !== 'photo' && newPost.type !== 'video' && newPost.type !== 'audio') return handleSuccess(newPost);
  if (files.length > 0) { // if there is media, upload to AWS
    let media = [];
    let path = process.env.AWS_BUCKET + `/users/${newPost.author}/blogs/${newPost.blog}/posts/${newPost._id}`;
    files.forEach(function (file) {
      let params = {
        Bucket: path,
        Key: file.originalname,
        Body: file.buffer, // the actual file in memory
        ACL: 'public-read' // set file permission for public read access
      };
      s3bucket.upload(params, function (err, uploadedFile) {
        if (err) return handleFailure(err);
        media.push(uploadedFile.Location);
        if (media.length === files.length) { // when all media files have been uploaded
          newPost.media = media; // add media URLs to be persisted
          handleSuccess(newPost); // send http response only after all media files have been uploaded
        }
      });
    });
  } else { // if no media files, send http response immediately
    handleSuccess(newPost);
  }
};

mediaUpload.deleteFiles = function (fileURLs, post, handleSuccess, handleFailure) {
  if (post.type !== 'photo' && post.type !== 'video' && post.type !== 'audio') return handleSuccess(post);
  if (!fileURLs || fileURLs.length <= 0) return handleSuccess(null); // if post has no files, do nothing.
  // if (typeof fileURLs === 'string') fileURLs = [fileURLs];
  // debugger
  let keyPrefix = `users/${post.author}/blogs/${post.blog}/posts/${post._id}/`;
  let keys = fileURLs.map(function (fileURL) {
    let key = keyPrefix + fileURL.split('/').pop();
    return { Key: key }
  });

  let params = {
    Bucket: bucket,
    Delete: {
      Objects: keys,
    },
  };
  s3bucket.deleteObjects(params, function (err, deletedFiles) {
    if (err) return handleFailure(err);
    handleSuccess(deletedFiles);
  });
};

mediaUpload.updateFiles = function (newFiles, post, handleSuccess, handleFailure) {
  if (post.type !== 'photo' && post.type !== 'video' && post.type !== 'audio') return handleSuccess(post);
  const oldFiles = (typeof post.oldFiles === 'string') ? [post.oldFiles] : post.oldFiles;
  const filesToDelete = (typeof post.filesToDelete === 'string') ? [post.filesToDelete] : post.filesToDelete;
  // debugger
  mediaUpload.deleteFiles(
    filesToDelete,
    post,
    () => {
      mediaUpload.uploadFiles(
        newFiles,
        post,
        (updatedPost) => {
          if (oldFiles) {
            updatedPost.media = lodash.union(oldFiles, updatedPost.media); // to add existing files
          }
          return handleSuccess(updatedPost);
        },
        (err) => handleFailure(err)
      );
    },
    (err) => handleFailure(err)
  );
};

module.exports = mediaUpload;