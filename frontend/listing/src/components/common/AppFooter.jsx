import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const QUICK_LINKS = [
  { label: 'Images', path: '/images' },
  { label: 'Contact US', path: '/fill-form' },
];

const LEGAL_LINKS = [
  { label: 'Privacy and policy', path: '/privacy-policy' },
  { label: 'Terms and Conditions', path: '/terms-and-conditions' },
  { label: 'Contact Us', path: '/fill-form' },
];

function AppFooter() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        mt: 3,
        py: 2.5,
        px: { xs: 2, md: 3 },
        borderTop: '1px solid rgba(15, 23, 42, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Stack spacing={2} sx={{ maxWidth: 1180, mx: 'auto' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              Category Hub
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', maxWidth: 420 }}>
              A curated destination for category-based image browsing, uploads, and quick access to request forms.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Quick Links
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {QUICK_LINKS.map((item, index) => (
                <Button
                  key={`${item.label}-${index}`}
                  size="small"
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{ textTransform: 'none', color: '#0f172a', px: 1 }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Legal & Support
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {LEGAL_LINKS.map((item, index) => (
                <Link
                  key={`${item.label}-${index}`}
                  component={RouterLink}
                  to={item.path}
                  underline="hover"
                  sx={{ color: '#0f172a', fontSize: '0.875rem', fontWeight: 500 }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>

            <Typography variant="body2" sx={{ color: '#475569', mt: 0.75 }}>
              Email:{' '}
              <Link href="mailto:support@categoryhub.app" underline="hover" sx={{ color: '#0f172a' }}>
                support@categoryhub.app
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Phone:{' '}
              <Link href="tel:+919876543210" underline="hover" sx={{ color: '#0f172a' }}>
                +91 98765 43210
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Support Hours: Mon - Fri, 9:00 AM - 6:00 PM
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(15, 23, 42, 0.08)' }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Typography variant="body2" sx={{ color: '#334155' }}>
            Category Hub {year}. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            By continuing to use this platform, you agree to our Privacy Policy and Terms.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default AppFooter;
