import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getAuthToken, getAuthUser, removeAuthToken, removeAuthUser, setAuthToken, setAuthUser } from '../common/utils';

const apiUrl = import.meta.env.VITE_BASE_URL;

function AdminLogin({ onSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setFormData((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!formData.email || !formData.password) {
      setStatus({ type: 'error', message: 'Please enter your email and password.' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (!data.user?.isAdmin) throw new Error('This account does not have admin access.');

      setAuthToken(data.token);
      setAuthUser(data.user);
      onSuccess();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 420, p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: '#1e1e2d',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <AdminPanelSettingsRoundedIcon sx={{ color: '#5d5fef', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Admin Login
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Category Hub — Admin Console
              </Typography>
            </Box>
          </Stack>

          <Divider />

          {status.message && <Alert severity={status.type || 'info'}>{status.message}</Alert>}

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                required
                fullWidth
                value={formData.email}
                onChange={handleChange('email')}
              />
              <TextField
                label="Password"
                type="password"
                required
                fullWidth
                value={formData.password}
                onChange={handleChange('password')}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ backgroundColor: '#5d5fef', '&:hover': { backgroundColor: '#4f51d4' } }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="caption" sx={{ color: '#94a3b8', textAlign: 'center' }}>
            Only authorized admin accounts can access this area.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

const SIDEBAR_WIDTH = 250;

const ADMIN_MENU = [
  {
    label: 'Upload Images',
    path: '/admin',
    match: '/admin',
    icon: CloudUploadRoundedIcon,
  },
  {
    label: 'Blocked Images',
    path: '/admin/blocked-images',
    match: '/admin/blocked-images',
    icon: ReportProblemRoundedIcon,
  },
];

function AdminPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Always clear auth on mount — admin must log in on every visit
  useEffect(() => {
    removeAuthToken();
    removeAuthUser();
  }, []);

  const isAuthenticated = !!getAuthToken() && !!currentUser?.isAdmin;

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setCurrentUser(getAuthUser())} />;
  }

  const handleLogout = () => {
    removeAuthToken();
    removeAuthUser();
    navigate('/login');
  };

  const displayName = currentUser?.name || currentUser?.email || 'Admin';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f0f2f5' }}>

      {/* ── Left sidebar ── */}
      <Box
        component="nav"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1e1e2d',
          color: '#a2a3b7',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Brand */}
        <Box
          sx={{
            px: 2,
            py: 2.5,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SpaceDashboardRoundedIcon sx={{ color: '#5d5fef', fontSize: 22 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2, fontSize: 13 }}>
              Category Hub
            </Typography>
          </Stack>
        </Box>

        {/* Nav items */}
        <Box sx={{ flex: 1, pt: 1 }}>
          {ADMIN_MENU.map((item) => {
            const isActive = item.match === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.match);
            const Icon = item.icon;

            return (
              <Box
                key={item.path}
                component="button"
                type="button"
                onClick={() => navigate(item.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  width: '100%',
                  px: 2,
                  py: 1.25,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  backgroundColor: isActive ? 'rgba(93, 95, 239, 0.18)' : 'transparent',
                  borderLeft: isActive ? '3px solid #5d5fef' : '3px solid transparent',
                  color: isActive ? '#fff' : '#a2a3b7',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                  },
                }}
              >
                <Icon sx={{ fontSize: 18, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: isActive ? 700 : 500, fontSize: 12.5, lineHeight: 1 }}>
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Logout at bottom */}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
        <Box
          component="button"
          type="button"
          onClick={handleLogout}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            width: '100%',
            px: 2,
            py: 1.5,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            color: '#a2a3b7',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff' },
          }}
        >
          <LogoutRoundedIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 12.5 }}>
            Logout
          </Typography>
        </Box>
      </Box>

      {/* ── Right side ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <Box
          sx={{
            height: 56,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: 3,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid rgba(15,23,42,0.08)',
            boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
          }}
        >
          <Tooltip title="Account options">
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <Avatar sx={{ width: 32, height: 32, backgroundColor: '#5d5fef', fontSize: 13, fontWeight: 700 }}>
                {initials}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>
                {displayName}
              </Typography>
              <IconButton size="small" sx={{ p: 0 }}>
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: '#64748b' }} />
              </IconButton>
            </Stack>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{ paper: { elevation: 3, sx: { mt: 0.5, minWidth: 160 } } }}
          >
            <MenuItem onClick={handleLogout} dense>
              <LogoutRoundedIcon sx={{ fontSize: 16, mr: 1, color: '#64748b' }} />
              Log Out
            </MenuItem>
          </Menu>
        </Box>

        {/* Content area */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            backgroundColor: '#f0f2f5',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AdminPanel;