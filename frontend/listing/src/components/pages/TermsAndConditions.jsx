import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';

const termsSections = [
  {
    title: 'Acceptance Of Terms',
    body: 'By using Category Hub, you agree to comply with these Terms and all applicable laws. If you do not agree, you should discontinue use of the platform.',
  },
  {
    title: 'User Responsibilities',
    body: 'Users must upload lawful, non-infringing content and provide accurate details when reporting issues. Abusive or fraudulent activity may lead to suspension or permanent account restrictions.',
  },
  {
    title: 'Content Moderation',
    body: 'Category Hub may review, restrict, or remove content that violates platform rules. Report submissions are used for moderation and safety workflows.',
  },
  {
    title: 'Limitation Of Liability',
    body: 'Category Hub is provided on an "as available" basis. We are not liable for indirect damages, data loss, or service interruption resulting from platform use.',
  },
  {
    title: 'Changes To Terms',
    body: 'We may update these terms periodically. Continued use after updates means acceptance of revised conditions. Significant changes will be highlighted in-app.',
  },
];

function TermsAndConditions() {
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
          border: '1px solid rgba(15, 118, 110, 0.22)',
          background: 'linear-gradient(140deg, #0b3d3a 0%, #0f766e 55%, #0891b2 100%)',
          color: '#ecfeff',
          mb: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap', rowGap: 0.5 }}>
          <GavelRoundedIcon sx={{ color: '#a5f3fc' }} />
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 24, sm: 28, md: 32 },
              lineHeight: 1.2,
            }}
          >
            Terms and Conditions
          </Typography>
        </Stack>
        <Typography
          sx={{
            color: '#cffafe',
            maxWidth: 840,
            fontSize: { xs: 13.5, sm: 14 },
            lineHeight: { xs: 1.55, sm: 1.6 },
          }}
        >
          Last updated: April 13, 2026. These sample terms define usage standards, moderation rights, and user obligations.
        </Typography>
      </Paper>

      <Stack spacing={1.5} sx={{ mb: 2 }}>
        <Chip label="Sample Terms Content" color="success" variant="outlined" sx={{ width: { xs: '100%', sm: 'fit-content' } }} />
      </Stack>

      <Stack spacing={{ xs: 1.5, sm: 2 }}>
        {termsSections.map((section, index) => (
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

export default TermsAndConditions;