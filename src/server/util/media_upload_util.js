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

mediaUpload.uploadFiles = function (files, createdPost, handleSuccess, handleFailure) {
  let media = [];
  if (files.length > 0) { // if there is media, upload to AWS
    let path = process.env.AWS_BUCKET + `/users/${createdPost.author}/blogs/${createdPost.blog}/posts/${createdPost._id}`;
    files.forEach(function (file) {
      let params = {
        Bucket: path,
        Key: file.originalname,
        Body: file.buffer, // the actual file in memory
        ACL: 'public-read' // set permission for public read access
      };
      s3bucket.upload(params, function (err, uploadedFile) {
        if (err) return handleFailure(err);
        media.push(uploadedFile.Location);
        if (media.length === files.length) { // when all media files have been uploaded
          createdPost.media = media; // add media URLs to be persisted
          createdPost.save();
          handleSuccess(createdPost); // send http response only after all media files have been uploaded
        }
      });
    });
  } else { // if no media files, send http response immediately
    handleSuccess(createdPost);
  }
}

module.exports = mediaUpload;