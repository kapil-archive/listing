import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import HeadsetMicRoundedIcon from '@mui/icons-material/HeadsetMicRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded';

const CATEGORY_OPTIONS = ['Electronics', 'Fashion', 'Home', 'Books', 'Toys'];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  category: '',
  message: '',
  agree: false,
};

function FillForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showSuccess, setShowSuccess] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return !(
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.category &&
      formData.message.trim() &&
      formData.agree
    );
  }, [formData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitDisabled) {
      return;
    }

    setShowSuccess(true);
    setFormData(INITIAL_FORM);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
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
          <ContactMailRoundedIcon sx={{ color: '#93c5fd' }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Contact Us
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: '#cbd5e1', maxWidth: 820 }}>
          Share your requirements, questions, or feedback. Our support and moderation team will review your submission and respond as soon as possible.
        </Typography>
      </Paper>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
          <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              border: '1px solid rgba(15, 23, 42, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Send A Request
              </Typography>
              <Chip size="small" color="info" variant="outlined" label="Response in 24-48 hours" />
            </Stack>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                required
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="email"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                minRows={5}
                fullWidth
                required
              />

              <FormControlLabel
                control={<Checkbox name="agree" checked={formData.agree} onChange={handleChange} />}
                label="I confirm that the provided details are accurate and consent to being contacted."
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" size="large" disabled={isSubmitDisabled} sx={{ px: 3, fontWeight: 700 }}>
                  Submit Request
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={1.5}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid rgba(15, 23, 42, 0.1)' }}>
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.5 }}>
                <MailOutlineRoundedIcon sx={{ color: '#2563eb' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Email Support</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                support@categoryhub.app
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid rgba(15, 23, 42, 0.1)' }}>
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.5 }}>
                <HeadsetMicRoundedIcon sx={{ color: '#0f766e' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Phone Support</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                +91 98765 43210
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid rgba(15, 23, 42, 0.1)' }}>
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.5 }}>
                <ScheduleRoundedIcon sx={{ color: '#7c3aed' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Working Hours</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                Mon - Fri: 9:00 AM - 6:00 PM
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                Sat: 10:00 AM - 2:00 PM
              </Typography>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar open={showSuccess} autoHideDuration={2500} onClose={() => setShowSuccess(false)}>
        <Alert severity="success" variant="filled" onClose={() => setShowSuccess(false)}>
          Request submitted successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FillForm;
