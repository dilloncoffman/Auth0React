import React from 'react';
import { Route } from 'react-router-dom'
import Home from './Home'
import Profile from './Profile'
import Nav from './Nav'
import Auth from './auth/Auth';
import Callback from './Callback'

function App(props) {
  const auth = new Auth(props.history);

  return (
    <>
      <Nav />
      <div className="body">
        {/* render prop in order to pass down auth as a prop to the Home component and spreading rest of props passed into this component */}
        <Route path="/" exact render={props => <Home auth={auth} {...props} />} />
        <Route path="/callback" render={props => <Callback auth={auth} {...props} />} />
        <Route path="/profile" component={Profile} />
      </div>

    </>
  );
}

export default App;
