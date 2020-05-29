import React, { useState, useEffect } from 'react';

function Private(props) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/private', {
      headers: { Authorization: `Bearer ${props.auth.getAccessToken()}` },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then((response) => setMessage(response.message))
      .catch((error) => setMessage(error.message));
  }, []);

  return <p>{message}</p>;
}

export default Private;
