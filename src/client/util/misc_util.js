import React from 'react';
import { isArray } from 'lodash';

export const toArray = function (list) {
  return Array.prototype.slice.call(list);
}

export const renderSpinner = function (className) {
  if (!className) return null; // only pass in className if need to render spinner
  return (
    <div className={className}>
      <div className="spinner">
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
      </div>
    </div>
  );
};

export const replaceArray = function (objValue, srcValue) {
  if (isArray(objValue)) {
    return srcValue;
  }
  // For arrays, replace old array with new array:
  // old = {arr: [1,2,3]}
  // new = {arr: [1, 2]}
  // mergewith(new, old, replaceArray) => {arr: [1,2]}
};

export const validateMediaUrl = function (url, expectedType, next) {
  // https://www.website.com/image.jpg is a valid URL
  let validUrlRegex = RegExp('(https:\/\/)(.+\/)([^\.]+)([\.])([^\.]{3,})');
  console.log(validUrlRegex.test(url));
  // if it fails the regex test, pass in null into next func
  if (!validUrlRegex.test(url)) return next(null);
  let img = new Image();
  img.src = url;
  img.onerror = () => next(null);
  img.onload = (e) => next('image exists!');
};