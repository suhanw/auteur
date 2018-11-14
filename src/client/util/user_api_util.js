export const fetchUserFeed = function (userId) {
    return $.ajax({
        method: 'GET',
        url: '/api/users/' + userId + '/feed',
    });
};