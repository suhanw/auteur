import React from 'react';
import { Link } from 'react-router-dom';

const Error = function (props) {
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

export default Error;