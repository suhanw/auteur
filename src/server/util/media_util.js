const lodash = require('lodash');

let mediaUtil = {};

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

mediaUtil.uploadFiles = function (newFiles, urls, post, blog) {
  return new Promise(function (resolve, reject) {
    urls = (typeof urls === 'string') ? [urls] : urls; // single element is passed by FormData as a string, so need to turn into array
    post.media = lodash.union(post.media, urls); // add urls to persist

    // if no new files to upload, resolve the promise 
    if (!newFiles || newFiles.length <= 0) return resolve({ post, blog });

    // otherwise, upload new files to AWS
    let path = process.env.AWS_BUCKET + `/users/${post.author}/blogs/${post.blog}/posts/${post._id}`;
    let uploadedFiles = new Array(newFiles.length); // create placeholder array of undefineds

    // iterate and upload each file
    newFiles.forEach(function (file, i) {
      let params = {
        Bucket: path,
        Key: file.originalname,
        Body: file.buffer, // the actual file in memory
        ACL: 'public-read' // set file permission for public read access
      };
      s3bucket.upload(params, function (err, uploadedFile) {
        if (err) return reject(err);
        uploadedFiles[i] = uploadedFile.Location; // this will preserve the order of files added by user
        if (!uploadedFiles.includes(undefined)) { // when all the nulls have been updated (ie, all media files have been uploaded)
          post.media = lodash.union(post.media, uploadedFiles); // then update post doc
          resolve({ post, blog }); // resolve only after all media files have been uploaded
        }
      });
    });

  });
};

mediaUtil.deleteFiles = function (post, blog) {
  return new Promise(function (resolve, reject) {
    let keyPrefix = `users/${post.author}/blogs/${post.blog}/posts/${post._id}/`;
    let files = [];
    // TODO: if filename has spaces in it, doesn't delete from AWS...
    if (post.media) { // scenario for delete post
      files = post.media.slice();
    } else if (post.filesToDelete) { // scenario for update post
      files = (typeof post.filesToDelete === 'string') ? [post.filesToDelete] : post.filesToDelete; // single element is passed by FormData as a string, so need to turn into array
    } else { // no files to delete
      return resolve({ post, blog });
    }
    let keys = files.map(function (fileURL) {
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

mediaUtil.updateFiles = function (newFiles, urls, post) {
  return new Promise(function (resolve, reject) {
    return mediaUtil.deleteFiles(post, null) // blog is not updated on post update, hence no need to pass as argument
      .then(({ post }) => {
        return mediaUtil.uploadFiles(newFiles, urls, post, null) // blog is not updated on post update, hence no need to pass in
      })
      .then(({ post }) => {
        return resolve(post);
      })
      .catch((err) => reject(err));
  });
}

module.exports = mediaUtil;