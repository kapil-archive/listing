import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';

const apiUrl = import.meta.env.VITE_BASE_URL;

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [extraLink, setExtraLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setExtraLink('');

    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your admin email address.' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/auth/password/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Unable to request password reset.');
      }

      setStatus({ type: 'success', message: data.message });
      if (data.resetUrl) {
        setExtraLink(data.resetUrl);
      }
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
            Reset Admin Password
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Enter the email associated with your admin account and we will send you reset instructions.
          </Typography>

          {status.message && <Alert severity={status.type || 'info'}>{status.message}</Alert>}
          {extraLink && (
            <Alert severity="info">
              Reset link: <Link href={extraLink} target="_blank" rel="noreferrer">Open reset page</Link>
            </Alert>
          )}

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={loading} size="large">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ color: '#475569' }}>
            Remembered your password?{' '}
            <Link component={RouterLink} to="/login" sx={{ cursor: 'pointer' }}>
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
