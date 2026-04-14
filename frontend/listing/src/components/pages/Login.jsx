import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { getAuthToken, getAuthUser, setAuthToken, setAuthUser } from '../common/utils';

const apiUrl = import.meta.env.VITE_BASE_URL;

function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const user = getAuthUser();

    if (token && user) {
      navigate(user.isAdmin ? '/admin' : '/images', { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleToggleMode = () => {
    setStatus({ type: '', message: '' });
    setIsRegister((current) => !current);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!formData.email || !formData.password || (isRegister && !formData.name)) {
      setStatus({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    try {
      setLoading(true);
      const url = `${apiUrl}/api/auth/${isRegister ? 'register' : 'login'}`;
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      if (isRegister) {
        payload.name = formData.name;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Request failed');
      }

      if (isRegister) {
        setStatus({ type: 'success', message: 'Registration successful. Please login to continue.' });
        setIsRegister(false);
        setFormData({ name: '', email: '', password: '' });
        return;
      }

      setAuthToken(data.token);
      setAuthUser(data.user);

      navigate(data.user?.isAdmin ? '/admin' : '/images', { replace: true });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to complete request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - 128px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 480, p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {isRegister ? 'Register for Admin Access' : 'Admin Login'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            {isRegister
              ? 'Create an account to manage uploads and moderation.'
              : 'Sign in with your admin credentials to access the admin console.'}
          </Typography>

          {status.message && <Alert severity={status.type || 'info'}>{status.message}</Alert>}

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {isRegister && (
                <TextField
                  label="Name"
                  required
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  fullWidth
                />
              )}
              <TextField
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange('email')}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange('password')}
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={loading} size="large">
                {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ color: '#475569' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link component="button" variant="body2" onClick={handleToggleMode} sx={{ cursor: 'pointer' }}>
              {isRegister ? 'Login instead' : 'Register now'}
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Login;
