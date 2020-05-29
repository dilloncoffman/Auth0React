import auth0 from 'auth0-js';

const REDIRECT_ON_LOGIN = 'redirect_on_login';

// Stored outside class since they're private
// eslint-disable-next-line no-unused-vars
let _idToken = null;
let _accessToken = null;
let _scopes = null;
let _expiresAt = null;

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = 'openid profile email read:courses'; // specifying custom scope of read:courses created on Auth0 API dashboard
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: 'token id_token',
      scope: this.requestedScopes, // specifying custom scope of read:courses created on Auth0 API dashboard
    });
  }

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    );
    this.auth0.authorize(); // redirect browser to Auth0 login page
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      // get the data passed over in the URL and parse that out
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult); // write that data to our session (local storage - NOT the preferred way of storing tokens but for now)
        // location to redirect to once the user is logged in (this is the page they were on before clicking log in so they are redirected back to where they were)
        const redirectLocation =
          localStorage.getItem(REDIRECT_ON_LOGIN) === 'undefined'
            ? '/'
            : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push('/');
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.log(err);
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };

  setSession = (authResult) => {
    // Set the time the access token will expire
    _expiresAt =
      // 1. authResult.expiresIn contains expiration in seconds
      // 2. Multiply by 1000 to convert into milliseconds
      // 3. Add current Unix epoch time
      // This gives us the Unix epoch time when the token will expire
      authResult.expiresIn * 1000 + new Date().getTime();

    /*
      If there is a values on the `scope` param from the authResult,
      use it to set scopes in the session for the user. Otherwise
      use the scopes as requested. If no scopes were requested,
      set it to nothing
    */
    _scopes = authResult.scope || this.requestedScopes || '';

    // Will switch later to storing tokens in memory with silent auth for SPA, but just using localStorage here to keep things simple
    _accessToken = authResult.accessToken;
    _idToken = authResult.idToken;
    this.scheduleTokenRenewal(); // will ask Auth0 for a new token when our current token expires
  };

  isAuthenticated = () => new Date().getTime() < _expiresAt;

  logout = () => {
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: 'http://localhost:3000',
    });
  };

  getAccessToken = () => {
    if (!_accessToken) {
      throw new Error('No access token found');
    }
    return _accessToken;
  };

  getProfile = (callback) => {
    if (this.userProfile) return callback(this.userProfile);

    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile;
      callback(profile, err);
    });
  };

  // Check if the user has a certain scope
  // Accepts an array of scopes
  // Checks for list of granted scopes by looking in local storage for list of scopes, if there's no scopes in localStorage then it defaults to an empty string and splits on that string
  // Uses .every to iterate over each scope and returns true fi list of scopes passed into userHasScopes exist in localStorage
  userHasScopes(scopes) {
    const grantedScopes = (_scopes || '').split(' ');
    return scopes.every((scope) => grantedScopes.includes(scope));
  }

  // Need to call this before the app is displayed/starts up so we know fi the user is logged in
  renewToken(cb) {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(`Error: ${err.error} - ${err.error_description}.`);
      } else {
        this.setSession(result);
      }
      if (cb) cb(err, result);
    });
  }

  scheduleTokenRenewal() {
    const delay = _expiresAt - Date.now();
    if (delay > 0) setTimeout(() => this.renewToken(), delay);
  }
}
