import React from 'react';

export const PostSpinner = function ({ spinnerClass }) {
  if (!spinnerClass) return null; // only pass in className if need to render spinner
  return (
    <div className={spinnerClass}>
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