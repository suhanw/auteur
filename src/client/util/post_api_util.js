export const fetchPosts = function () {
    return $.ajax({
        method: 'GET',
        url: '/api/posts',
    });
};