export const LOAD_POST_SUBMIT = 'LOAD_POST_SUBMIT';
export const LOAD_POST_INDEX = 'LOAD_POST_INDEX';
export const LOAD_SEARCH_POSTS = 'LOAD_SEARCH_POSTS';

export const loadPostSubmit = function () {
  return {
    type: LOAD_POST_SUBMIT,
  };
}

export const loadPostIndex = function () {
  return {
    type: LOAD_POST_INDEX,
  };
};


export const loadSearchPosts = function () {
  return {
    type: LOAD_SEARCH_POSTS,
  }
}