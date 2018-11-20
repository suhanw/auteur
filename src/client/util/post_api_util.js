export const fetchPosts = function () {
    return $.ajax({
        method: 'GET',
        url: '/api/posts',
    });
};

export const createPost = function (post) {
    return $.ajax({
        method: 'POST',
        url: `/api/blogs/${post.blog}/posts`,
        data: post,
    });
};

export const deletePost = function (post) {
    return $.ajax({
        method: 'DELETE',
        url: `/api/blogs/${post.blog}/posts/${post._id}`,
    });
};

export const updatePost = function (post) {
    return $.ajax({
        method: 'PUT',
        url: `/api/blogs/${post.blog}/posts/${post._id}`,
        data: post,
    });
};