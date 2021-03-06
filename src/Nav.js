import React from 'react';
import { Link } from 'react-router-dom';

function Nav(props) {
  const { auth } = props;
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/public">Public</Link>
        </li>
        {auth.isAuthenticated() && (
          <li>
            <Link to="/private">Private</Link>
          </li>
        )}
        {auth.isAuthenticated() && auth.userHasScopes(['read:courses']) && (
          <li>
            <Link to="/courses">Courses</Link>
          </li>
        )}
        <li>
          <button
            type="button"
            onClick={auth.isAuthenticated() ? auth.logout : auth.login}
          >
            {auth.isAuthenticated() ? 'Log Out' : 'Log In'}
          </button>
        </li>
      </ul>
    </nav>
  );
}
export default Nav;
