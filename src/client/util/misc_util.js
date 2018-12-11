import { isArray } from 'lodash';

export const replaceArray = function (objValue, srcValue) {
  if (isArray(objValue)) {
    return srcValue;
  }
  // For arrays, replace old array with new array:
  // old = {arr: [1,2,3]}
  // new = {arr: [1, 2]}
  // mergewith(new, old, replaceArray) => {arr: [1,2]}
};

export const toArray = function (list) {
  return Array.prototype.slice.call(list);
}

export const validateUrl = function (url, expectedType, next) {
  // https://www.website.com is a valid URL
  let validLinkUrl = RegExp('(https:\/\/)(.+)([\.])([^\.]+)');
  // https://www.website.com/image.jpg is a valid URL
  let validImageUrl = RegExp('(https:\/\/)(.+\/)([^\.]+)([\.])([^\.]{3,})');

  switch (expectedType) {
    case 'link':
      if (!validLinkUrl.test(url)) return next(null);
      $.ajax({ // query the link through our server as proxy
        url: '/api/linkpreview',
        method: 'POST',
        data: { linkUrl: url },
      })
        .then((responseHtml) => {
          let linkHtml = new DOMParser().parseFromString(responseHtml, 'text/html');
          let linkMeta = {}

          linkMeta.linkTitle = linkHtml.querySelector('head title') ? linkHtml.querySelector('head title').textContent : null;
          linkMeta.linkMetaDesc = linkHtml.querySelector('meta[name="description"]') ? linkHtml.querySelector('meta[name="description"]').getAttribute('content') : null;
          linkMeta.linkMetaOgTitle = linkHtml.querySelector('meta[property="og:title"]') ? linkHtml.querySelector('meta[property="og:title"]').getAttribute('content') : null;
          linkMeta.linkMetaOgDesc = linkHtml.querySelector('meta[property="og:description"]') ? linkHtml.querySelector('meta[property="og:description"]').getAttribute('content') : null;
          linkMeta.linkMetaImage = linkHtml.querySelector('meta[property="og:image"]') ? linkHtml.querySelector('meta[property="og:image"]').getAttribute('content') : null;

          return next(linkMeta);
        })
        .catch((err) => next(null))
      break;
    case 'image':
      // if it fails the regex test, pass in null into next func
      if (!validImageUrl.test(url)) return next(null);
      let img = new Image();
      img.src = url;
      img.onerror = () => next(null);
      img.onload = (e) => next('image exists!');
      break;
    default:
      break;
  }
};


export const pluralize = function (count, singular, plural) {
  if (count === 1) return singular;
  return plural;
};