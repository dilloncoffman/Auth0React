import auth0 from 'auth0-js';

export default class Auth {
  constructor(history) {
    this.history = history;
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      responseType: 'token id_token',
      scope: 'openid profile email',
    });
  }

  login = () => {
    this.auth0.authorize(); // redirect browser to Auth0 login page
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      // get the data passed over in the URL and parse that out
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult); // write that data to our session (local storage - NOT the preferred way of storing tokens but for now)
        this.history.push('/');
      } else if (err) {
        this.history.push('/');
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.log(err);
      }
    });
  };

  setSession = (authResult) => {
    // Set the time the access token will expire
    const expiresAt = JSON.stringify(
      // 1. authResult.expiresIn contains expiration in seconds
      // 2. Multiply by 1000 to convert into milliseconds
      // 3. Add current Unix epoch time
      // This gives us the Unix epoch time when the token will expire
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    // Will switch later to storing tokens in memory with silent auth for SPA, but just using localStorage here to keep things simple
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  };
}
