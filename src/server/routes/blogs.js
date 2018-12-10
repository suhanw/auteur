const express = require('express');
const router = express.Router();

const modelQuery = require('../util/model_query_util');
const middleware = require('../middleware/middleware');


// GET api/blogs/:id - SHOW blog
router.get('/blogs/:id', middleware.isLoggedIn, function (req, res) {
    modelQuery.findOneBlog(req.params.id)
        .then((foundBlog) => {
            return res.json(foundBlog);
        })
        .catch((err) => res.status(404).json(['The blog does not exist.']));
});

module.exports = router;