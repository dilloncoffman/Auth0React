const express = require('express');
require('dotenv').config();
const jwt = require('express-jwt'); // Validate JWT and set req.user
const jwksRsa = require('jwks-rsa'); // Retrieve RSA keys from a JSON Web Key set (JWKS) endpoint that Auth0 exposes under our domain
const checkScope = require('express-jwt-authz'); // Validates JWT scopes

// Validates that information inside the JWT is valid and ensures the JWT was generated by Auth0, it uses the public signing key Auth0 exposes for our domain
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signed key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // This must match the algorithm selected in the Auth0 dashboard under your app's advanced settings under the OAuth tab
  algorithms: ['RS256'],
});

const app = express();

app.get('/public', (req, res) => {
  res.json({
    message: 'Hello from a public API!',
  });
});

// checkJwt middleware to validate JWT
app.get('/private', checkJwt, (req, res) => {
  res.json({
    message: 'Hello from a private API!',
  });
});

function checkRole(role) {
  return function (req, res, next) {
    const assignedRoles = req.user['http://localhost:3000/roles'];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    }
    return res.status(401).send('Insufficient role');
  };
}

// Use checkScope middleware to check that user has the read:courses scope in their access token
app.get('/course', checkJwt, checkScope(['read:courses']), (req, res) => {
  res.json({
    courses: [
      { id: 1, title: 'Building Apps with React and Redux' },
      { id: 2, title: 'Creating Reusable React Components' },
    ],
  });
});

// checkJwt middleware to validate JWT
app.get('/admin', checkJwt, checkRole('admin'), (req, res) => {
  res.json({
    message: 'Hello from an ADMIN private API!',
  });
});

app.listen(3001);
console.log(`API server listening on ${process.env.REACT_APP_API_URL}`);
