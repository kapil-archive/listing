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
    <Box
      sx={{
        width: '100%',
        maxWidth: 980,
        mx: 'auto',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: { xs: 2.25, sm: 3 },
          border: '1px solid rgba(30, 64, 175, 0.2)',
          background: 'linear-gradient(140deg, #0f172a 0%, #1e293b 55%, #1d4ed8 100%)',
          color: '#e2e8f0',
          mb: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap', rowGap: 0.5 }}>
          <SecurityRoundedIcon sx={{ color: '#93c5fd' }} />
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 24, sm: 28, md: 32 },
              lineHeight: 1.2,
            }}
          >
            Privacy Policy
          </Typography>
        </Stack>
        <Typography
          sx={{
            color: '#cbd5e1',
            maxWidth: 840,
            fontSize: { xs: 13.5, sm: 14 },
            lineHeight: { xs: 1.55, sm: 1.6 },
          }}
        >
          Last updated: April 13, 2026. This sample policy explains how Category Hub collects, uses, and protects user data.
        </Typography>
      </Paper>

      <Stack spacing={1.5} sx={{ mb: 2 }}>
        <Chip label="Sample Policy Content" color="primary" variant="outlined" sx={{ width: { xs: '100%', sm: 'fit-content' } }} />
      </Stack>

      <Stack spacing={{ xs: 1.5, sm: 2 }}>
        {policySections.map((section, index) => (
          <Paper
            key={section.title}
            elevation={0}
            sx={{
              p: { xs: 1.75, sm: 2, md: 2.5 },
              borderRadius: { xs: 2, sm: 2.5 },
              border: '1px solid rgba(15, 23, 42, 0.1)',
            }}
          >
            <Typography sx={{ fontWeight: 700, mb: 0.75, fontSize: { xs: 17, sm: 20 } }}>
              {index + 1}. {section.title}
            </Typography>
            <Divider sx={{ mb: 1.25 }} />
            <Typography sx={{ color: '#475569', lineHeight: 1.7, fontSize: { xs: 13.5, sm: 14 } }}>
              {section.body}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default PrivacyPolicy;