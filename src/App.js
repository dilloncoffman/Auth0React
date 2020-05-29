/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Nav from './Nav';
import Auth from './auth/Auth';
import Callback from './Callback';
import Public from './Public';
import Private from './Private';
import Courses from './Courses';
import PrivateRoute from './PrivateRoute';
import AuthContext from './AuthContext';

function App(props) {
  const { history } = props;
  const [auth] = useState(new Auth(history));

  return (
    <AuthContext.Provider value={auth}>
      <Nav auth={auth} />
      <div className="body">
        {/* render prop in order to pass down auth as a prop to the Home component and spreading rest of props passed into this component */}
        <Route
          path="/"
          exact
          render={(props) => <Home auth={auth} {...props} />}
        />
        <Route
          path="/callback"
          render={(props) => <Callback auth={auth} {...props} />}
        />
        <PrivateRoute path="/profile" component={Profile} />
        <Route path="/public" component={Public} />
        <PrivateRoute path="/private" component={Private} />
        <PrivateRoute
          path="/courses"
          component={Courses}
          scopes={['read:courses']}
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
