import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import InstallPWA from './InstallPWA';

const NAV_OPTIONS = [
  { label: 'Privacy and policy', path: '/' },
  { label: 'Terms and Conditions', path: '/' },
  { label: 'Fill Form', path: '/fill-form' },
];

function AppHeader() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setOpenMobileMenu(false);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          width: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
          color: '#0f172a',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ px: { xs: 1.5, md: 2 } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
            <CategoryRoundedIcon sx={{ color: '#0f766e' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.3 }}>
              Category Hub
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {NAV_OPTIONS.map((item, index) => (
              <Button
                key={`${item.label}-${index}`}
                variant={isActivePath(item.path) ? 'contained' : 'text'}
                onClick={() => handleNavigate(item.path)}
                sx={{ borderRadius: 999 }}
              >
                {item.label}
              </Button>
            ))}
            <InstallPWA />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'flex', md: 'none' } }}>
            <InstallPWA />
            <IconButton color="inherit" onClick={() => setOpenMobileMenu(true)}>
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={openMobileMenu} onClose={() => setOpenMobileMenu(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Typography variant="subtitle1" sx={{ px: 2, pb: 1, fontWeight: 700 }}>
            Menu
          </Typography>
          <List>
            {NAV_OPTIONS.map((item, index) => (
              <ListItemButton
                key={`${item.label}-${index}`}
                selected={isActivePath(item.path)}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default AppHeader;
