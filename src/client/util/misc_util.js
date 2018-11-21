import React from 'react';

export const toArray = function (fileList) {
  return Array.prototype.slice.call(fileList);
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