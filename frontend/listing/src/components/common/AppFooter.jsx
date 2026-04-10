import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';

const FOOTER_LINKS = [
  { label: 'Images', path: '/images' },
  { label: 'Admin Upload', path: '/admin' },
  { label: 'Privacy and policy', path: '/' },
  { label: 'Terms and Conditions', path: '/' },
];

function AppFooter() {
  const navigate = useNavigate();
  const location = useLocation();
  const year = new Date().getFullYear();
  const hasBottomOverlay = location.pathname === '/images';

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        mt: 3,
        py: 2,
        px: { xs: 2, md: 3 },
        borderTop: '1px solid rgba(15, 23, 42, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ maxWidth: 1180, mx: 'auto' }}
      >
        <Typography variant="body2" sx={{ color: '#334155' }}>
          Category Hub {year}. All rights reserved.
        </Typography>

        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {FOOTER_LINKS.map((item, index) => (
            <Button
              key={`${item.label}-${index}`}
              size="small"
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{ textTransform: 'none', color: '#0f172a' }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

export default AppFooter;
