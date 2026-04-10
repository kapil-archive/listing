import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
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
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
        Fill Form
      </Typography>
      <Typography variant="body1" sx={{ color: '#475569', mb: 3, textAlign: 'center' }}>
        Share your details and request. We will review your submission and get back to you shortly.
      </Typography>

      <Grid container spacing={2.5} justifyContent="center">
        <Grid item xs={12} md={9} lg={8}>
          <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
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
                minRows={4}
                fullWidth
                required
              />

              <FormControlLabel
                control={<Checkbox name="agree" checked={formData.agree} onChange={handleChange} />}
                label="I confirm that the provided details are correct."
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" size="large" disabled={isSubmitDisabled}>
                  Submit Form
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={showSuccess} autoHideDuration={2500} onClose={() => setShowSuccess(false)}>
        <Alert severity="success" variant="filled" onClose={() => setShowSuccess(false)}>
          Form submitted successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FillForm;
