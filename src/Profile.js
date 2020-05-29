import React, { useState, useEffect } from 'react';

function Profile(props) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  const { auth } = props;

  function loadUserProfile() {
    auth.getProfile((callbackProfile, callbackError) => {
      setProfile(callbackProfile);
      setError(callbackError);
    });
  }

  useEffect(() => {
    loadUserProfile();
  }, []);

  if (!profile) return null;

  return (
    <>
      <h1>Profile</h1>
      <p>{profile.nickname}</p>
      <img
        style={{ maxWidth: 50, maxHeight: 50 }}
        src={profile.picture}
        alt="User profile"
      />
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </>
  );
}

export default Profile;
