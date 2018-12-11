export const signup = function(user) {
  return $.ajax({
    method: 'POST',
    url: '/api/users',
    data: user,
  });
};

export const login = function(user) {
  return $.ajax({
    method: 'POST',
    url: 'api/session',
    data: user,
  });
};

export const logout = function() {
  return $.ajax({
    method: 'DELETE',
    url: 'api/session',
  });
};
