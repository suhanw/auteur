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

mediaUpload.uploadFiles = function (newFiles, urls, post, blog) {
  return new Promise(function (resolve, reject) {
    urls = (typeof urls === 'string') ? [urls] : urls; // single element is passed by FormData as a string, so need to turn into array
    post.media = lodash.union(post.media, urls); // add urls to persist
    // if no new files to upload, resolve the promise 
    if (!newFiles || newFiles.length <= 0) return resolve({ post, blog });

    // otherwise, upload new files to AWS
    let path = process.env.AWS_BUCKET + `/users/${post.author}/blogs/${post.blog}/posts/${post._id}`;
    let uploadedFiles = [];
    newFiles.forEach(function (file) {
      let params = {
        Bucket: path,
        Key: file.originalname,
        Body: file.buffer, // the actual file in memory
        ACL: 'public-read' // set file permission for public read access
      };
      s3bucket.upload(params, function (err, uploadedFile) {
        if (err) return reject(err);
        uploadedFiles.push(uploadedFile.Location);
        if (uploadedFiles.length === newFiles.length) { // when all media files have been uploaded
          post.media = post.media.concat(uploadedFiles); // add media URLs to be persisted
          resolve({ post, blog }); // resolve only after all media files have been uploaded
        }
      });
    });
  });
};

mediaUpload.deleteFiles = function (post, blog) {
  return new Promise(function (resolve, reject) {
    let keyPrefix = `users/${post.author}/blogs/${post.blog}/posts/${post._id}/`;
    let keys = post.media.map(function (fileURL) {
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
      if (err) return reject(err);
      resolve({ post, blog });
    });
  });
}

mediaUpload.updateFiles = function (newFiles, post, handleSuccess, handleFailure) {
  if (post.type !== 'photo' && post.type !== 'video' && post.type !== 'audio') return handleSuccess(post);
  const urls = (typeof post.urls === 'string') ? [post.urls] : post.urls;
  const filesToDelete = (typeof post.filesToDelete === 'string') ? [post.filesToDelete] : post.filesToDelete;
  mediaUpload.deleteFiles(
    filesToDelete,
    post,
    () => {
      mediaUpload.uploadFiles(
        newFiles,
        post,
        (updatedPost) => {
          if (urls) { //  add existing files if any
            updatedPost.media = lodash.union(urls, updatedPost.media);
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