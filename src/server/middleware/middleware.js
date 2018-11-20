const modelQuery = require('../util/model_query_util');

let middlewareObj = {}

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json(['You need to be logged in to do that. ']);
};

middlewareObj.checkPostOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    modelQuery.findOnePost(
      req.params.postId,
      (foundPost) => {
        if (foundPost.author.equals(req.user._id)) {
          return next();
        }
        return res.status(401).json(['You are not authorized to do that. ']);
      },
      (err) => res.status(422).json(['Action was not processed. ']) // fail callback
    );
  } else {
    return res.status(401).json(['You need to be logged in to do that. ']);
  }
}

module.exports = middlewareObj;
