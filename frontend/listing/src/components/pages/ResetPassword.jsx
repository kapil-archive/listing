import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';

const apiUrl = import.meta.env.VITE_BASE_URL;

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const queryToken = searchParams.get('token');
    if (!queryToken) {
      setStatus({ type: 'error', message: 'Reset token is missing. Use the link from your reset email.' });
      return;
    }
    setToken(queryToken);
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!token) {
      setStatus({ type: 'error', message: 'Reset token is not available.' });
      return;
    }
    if (!password || !confirmPassword) {
      setStatus({ type: 'error', message: 'Please enter and confirm your new password.' });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/auth/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Unable to reset password.');
      }

      setStatus({ type: 'success', message: data.message });
      setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to complete request.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - 128px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 480, p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Set New Password
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Enter a new password for your admin account.
          </Typography>

          {status.message && <Alert severity={status.type || 'info'}>{status.message}</Alert>}

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="New Password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
              />
              <TextField
                label="Confirm Password"
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={loading || !token} size="large">
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ color: '#475569' }}>
            Back to{' '}
            <Link component={RouterLink} to="/login" sx={{ cursor: 'pointer' }}>
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default ResetPassword;
