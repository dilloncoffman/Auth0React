import React, { useEffect } from 'react';

function Callback(props) {
  useEffect(() => {
    // Handle authentication if expected values are in the URL
    if (/access_token|id_token|error/.test(props.location.hash)) {
      props.auth.handleAuthentication();
    } else {
      throw new Error('Invalid callback URL.');
    }
    // empty dependency array for componentDidMount lifecycle functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <h1>Loading...</h1>;
}

export default Callback;
