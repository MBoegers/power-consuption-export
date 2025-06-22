import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Import from './components/Import';
import ExportCsvPage from './components/ExportCsvPage';
import AnalysePage from './components/AnalysePage';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const isAuthenticated = () => !!localStorage.getItem('token');

const LinkBehavior = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = React.useState(isAuthenticated());

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
      <Router>
        <div className="App">
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Power Consumption
              </Typography>
              {loggedIn && (
                <Box>
                  <Button color="inherit" component={LinkBehavior} to="/export">Export</Button>
                  <Button color="inherit" component={LinkBehavior} to="/analyse">Analyse</Button>
                  <Button color="inherit" component={LinkBehavior} to="/import">Import</Button>
                  <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Box>
              )}
              {!loggedIn && (
                <Button color="inherit" component={LinkBehavior} to="/login">Login</Button>
              )}
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 3 }}>
            <Switch>
              <Route path="/login" render={() => <Login onLogin={handleLogin} />} />
              <Route path="/export" render={() => loggedIn ? <ExportCsvPage /> : <Redirect to="/login" />} />
              <Route path="/analyse" render={() => loggedIn ? <AnalysePage /> : <Redirect to="/login" />} />
              <Route path="/import" render={() => loggedIn ? <Import /> : <Redirect to="/login" />} />
              <Route path="/" render={() => loggedIn ? <Redirect to="/export" /> : <Redirect to="/login" />} />
            </Switch>
          </Box>
        </div>
      </Router>
  );
};

export default App;
