let mediaUpload = {};

// SET UP AWS FILE UPLOAD=====================
const AWS = require('aws-sdk');

let s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  Bucket: process.env.AWS_BUCKET,
});
// SET UP AWS FILE UPLOAD=====================

mediaUpload.uploadFiles = function (files, newPost, handleSuccess, handleFailure) {
  let media = [];
  if (files.length > 0) { // if there is media, upload to AWS
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
}

mediaUpload.deleteFiles = function (fileURLs, postToDelete, handleSuccess, handleFailure) {
  // debugger
  let prefix = `users/${postToDelete.author}/blogs/${postToDelete.blog}/posts/${postToDelete._id}/`;
  let params = {
    Bucket: process.env.AWS_BUCKET,
    Delimiter: '/',
    Prefix: prefix,
  };

  s3bucket.listObjects(params, function (err, data) {
    if (err) return console.log(err);
    console.log(data);
  });
}

module.exports = mediaUpload;