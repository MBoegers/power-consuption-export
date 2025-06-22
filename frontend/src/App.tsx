import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
//import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Export from './components/Export';
import Import from './components/Import';

const isAuthenticated = () => !!localStorage.getItem('token');

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = React.useState(isAuthenticated());

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  //<img src={logo} className="App-logo" alt="logo" />
  return (
      <Router>
        <div className="App">
          <header className="App-header">
            {loggedIn && (
              <nav style={{ marginBottom: 20 }}>
                <Link to="/export" style={{ marginRight: 10 }}>Export</Link>
                <Link to="/import" style={{ marginRight: 10 }}>Import</Link>
                <button onClick={handleLogout} style={{ marginLeft: 10 }}>Logout</button>
              </nav>
            )}
            {!loggedIn && (
              <nav style={{ marginBottom: 20 }}>
                <Link to="/login">Login</Link>
              </nav>
            )}
            <Switch>
              <Route path="/login" render={() => <Login onLogin={handleLogin} />} />
              <Route path="/export" render={() => loggedIn ? <Export /> : <Redirect to="/login" />} />
              <Route path="/import" render={() => loggedIn ? <Import /> : <Redirect to="/login" />} />
              <Route path="/" render={() => loggedIn ? <Redirect to="/export" /> : <Redirect to="/login" />} />
            </Switch>
          </header>
        </div>
      </Router>
  );
};

export default App;
