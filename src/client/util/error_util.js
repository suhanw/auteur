import React from 'react';

export const renderErrors = function (errorArr) {
  if (!errorArr || errorArr.length === 0) { return null; }
  let errorLis = errorArr.map((error, idx) => (<li key={idx}>{error}</li>));
  return (
    <ul className='error-alert object-fade-in'>
      {errorLis}
    </ul>
  );
}