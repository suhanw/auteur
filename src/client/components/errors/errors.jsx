import React from 'react';
import { Link } from 'react-router-dom';

export const ErrorPage = function (props) {
  return (
    <div className='error-page'>
      <div className='error-message'>
        <h1>There's nothing here</h1>
        <p>
          Whatever you were looking for doesn't currently exist at this address.
          Unless you were looking for this error page, in which case: Congrats! You totally found it.
        </p>
        <p>
          Click <Link to='/dashboard'>here</Link> to go back to dashboard. Unless you wanna hang out with John (and I don't blame you if you do).
        </p>
      </div>
    </div>
  );
};

export const ErrorMessage = function ({ errorArr }) {
  if (!errorArr || !errorArr.length) { return null; }
  let errorLis = errorArr.map((error, idx) => (<li key={idx}>{error}</li>));
  return (
    <ul className='error-alert object-fade-in'>
      {errorLis}
    </ul>
  );
};