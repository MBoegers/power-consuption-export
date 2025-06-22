import React, { useState } from 'react';
import api from '../api';
import { useHistory } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Alert } from '@mui/material';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Verwende das gemockte api-Modul statt axios direkt
      const response = await api.post('/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      onLogin();
      history.push('/');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 350, mx: 'auto', mt: 6, p: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </form>
    </Paper>
  );
};

export default Login;
