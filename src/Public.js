import React, { useState, useEffect } from 'react';

function Public() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/public')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then((response) => setMessage(response.message))
      .catch((error) => setMessage(error.message));
  }, []);

  return <p>{message}</p>;
}

export default Public;
