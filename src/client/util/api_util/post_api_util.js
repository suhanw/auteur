export const fetchFeed = function (limit, lastPostDate, lastPostId) {
    return $.ajax({
        method: 'GET',
        url: `/api/feed/?limit=${limit}&lastPostDate=${lastPostDate}&lastPostId=${lastPostId}`,
    });
};

export const fetchPostsByBlog = function (blogId) {
    return $.ajax({
        method: 'GET',
        url: `/api/blogs/${blogId}/posts`,
    });
};

export const fetchPost = function (postId) {
    return $.ajax({
        method: 'GET',
        url: `/api/posts/${postId}`,
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