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

mediaUpload.uploadFiles = function (files, post, handleSuccess, handleFailure) {
  if (post.type !== 'photo' && post.type !== 'video' && post.type !== 'audio') return handleSuccess(post);
  if (!files || files.length <= 0) return handleSuccess(post); // if no media, send response immediately
  let media = [];
  let path = process.env.AWS_BUCKET + `/users/${post.author}/blogs/${post.blog}/posts/${post._id}`;
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
        post.media = media; // add media URLs to be persisted
        handleSuccess(post); // send http response only after all media files have been uploaded
      }
    });
  });
};

mediaUpload.deleteFiles = function (fileURLs, post, handleSuccess, handleFailure) {
  if (post.type !== 'photo' && post.type !== 'video' && post.type !== 'audio') return handleSuccess(post);
  if (!fileURLs || fileURLs.length <= 0) return handleSuccess(post); // if post has no files, do nothing.
  if (typeof fileURLs === 'string') fileURLs = [fileURLs];
  let keyPrefix = `users/${post.author}/blogs/${post.blog}/posts/${post._id}/`;
  let keys = fileURLs.map(function (fileURL) {
    let key = keyPrefix + fileURL.split('/').pop(); // pop the last element to get the filename
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
  mediaUpload.deleteFiles(
    filesToDelete,
    post,
    () => {
      mediaUpload.uploadFiles(
        newFiles,
        post,
        (updatedPost) => {
          if (oldFiles) { //  add existing files if any
            updatedPost.media = lodash.union(oldFiles, updatedPost.media);
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