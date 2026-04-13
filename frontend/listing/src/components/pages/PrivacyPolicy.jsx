import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';

const policySections = [
  {
    title: 'Information We Collect',
    body: 'We collect account details such as name and email, support messages submitted through forms, and technical usage data like device type and browser details. When users upload report attachments, those files are securely stored for moderation review.',
  },
  {
    title: 'How We Use Information',
    body: 'Collected information is used to provide platform features, improve browsing experience, investigate abuse reports, and communicate service updates. We do not sell personal data to third parties.',
  },
  {
    title: 'Data Retention',
    body: 'We retain uploaded media and moderation reports only as long as necessary for platform operations, legal compliance, and abuse prevention. Users can contact support for data correction or deletion requests.',
  },
  {
    title: 'Security Practices',
    body: 'Category Hub applies access controls, encrypted transport (HTTPS), and restricted admin workflows for sensitive report data. While we use reasonable safeguards, no internet service can guarantee absolute security.',
  },
  {
    title: 'Contact For Privacy Requests',
    body: 'For privacy or data rights requests, email privacy@categoryhub.app. We respond to verified requests within 7 business days.',
  },
];

function PrivacyPolicy() {
  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          border: '1px solid rgba(30, 64, 175, 0.2)',
          background: 'linear-gradient(140deg, #0f172a 0%, #1e293b 55%, #1d4ed8 100%)',
          color: '#e2e8f0',
          mb: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <SecurityRoundedIcon sx={{ color: '#93c5fd' }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Privacy Policy
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: '#cbd5e1', maxWidth: 840 }}>
          Last updated: April 13, 2026. This sample policy explains how Category Hub collects, uses, and protects user data.
        </Typography>
      </Paper>

      <Stack spacing={1.5} sx={{ mb: 2 }}>
        <Chip label="Sample Policy Content" color="primary" variant="outlined" sx={{ width: 'fit-content' }} />
      </Stack>

      <Stack spacing={2}>
        {policySections.map((section, index) => (
          <Paper key={section.title} elevation={0} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 2.5, border: '1px solid rgba(15, 23, 42, 0.1)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.75 }}>
              {index + 1}. {section.title}
            </Typography>
            <Divider sx={{ mb: 1.25 }} />
            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7 }}>
              {section.body}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default PrivacyPolicy;