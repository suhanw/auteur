export const fetchFeed = function () {
    return $.ajax({
        method: 'GET',
        url: '/api/feed',
    });
};

export const createPost = function (post) {
    return $.ajax({
        method: 'POST',
        url: `/api/blogs/${post.get('blog')}/posts`,
        data: post,
        contentType: false, // to enable use of FormData
        processData: false,
    });
};

export const deletePost = function (post) {
    return $.ajax({
        method: 'DELETE',
        url: `/api/blogs/${post.blog}/posts/${post._id}`,
        data: post,
        // contentType: false,
        // processData: false,
    });
};

export const updatePost = function (post) {
    return $.ajax({
        method: 'PUT',
        url: `/api/blogs/${post.get('blog')}/posts/${post.get('_id')}`,
        data: post,
        contentType: false,
        processData: false,
    });
};