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
    // debugger
    return $.ajax({
        method: 'DELETE',
        url: `/api/blogs/${post.blog}/posts/${post._id}`,
    });
};