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