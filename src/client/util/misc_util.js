export const toArray = function (fileList) {
  return Array.prototype.slice.call(fileList);
}


import React from 'react';

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


import { isArray } from 'lodash';

export const replaceArray = function (objValue, srcValue) {
  if (isArray(objValue)) {
    return srcValue;
  }
  // For arrays, replace old array with new array:
  // old = {arr: [1,2,3]}
  // new = {arr: [1, 2]}
  // mergewith(new, old, replaceArray) => {arr: [1,2]}
}