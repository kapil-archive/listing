import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getAuthToken, getAuthUser, removeAuthToken, removeAuthUser } from '../common/utils';

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
  const currentUser = getAuthUser();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !currentUser?.isAdmin) {
      navigate('/login', { replace: true });
    }
  }, [currentUser?.isAdmin, navigate]);

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