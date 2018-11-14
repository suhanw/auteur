let middlewareObj = {}

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json(['You need to be logged in to do that. ']);
};

module.exports = middlewareObj;
