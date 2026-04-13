import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const apiUrl = import.meta.env.VITE_BASE_URL;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ReportDialog({ reportDialog, setReportDialog, onSuccess }) {
    const [file, setFile] = useState(null);
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        if (!reportDialog.active) {
            setFile(null);
            setFormValues({ name: '', email: '', message: '' });
            setSubmitting(false);
            setError('');
            setSuccessMessage('');
            setEmailError('');
        }
    }, [reportDialog.active]);

    const handleClose = () => {
        if (submitting) {
            return;
        }

        setReportDialog({ active: false, item: null });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
        setError('');
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setError('');

        if (name === 'email') {
            const trimmedEmail = value.trim();

            if (!trimmedEmail) {
                setEmailError('');
            } else if (!EMAIL_REGEX.test(trimmedEmail)) {
                setEmailError('Please enter a valid email address.');
            } else {
                setEmailError('');
            }
        }
    };

    const handleSubmit = async () => {
        const imageId = reportDialog.item?.imageId || reportDialog.item?._id;
        const categoryId = reportDialog.item?.categoryId;

        if (!imageId || !categoryId) {
            setError('Missing image or category details.');
            return;
        }

        const trimmedName = formValues.name.trim();
        const trimmedEmail = formValues.email.trim();
        const trimmedMessage = formValues.message.trim();

        if (!trimmedName || !trimmedEmail || !trimmedMessage) {
            setError('Name, email, and message are required.');
            return;
        }

        if (!EMAIL_REGEX.test(trimmedEmail)) {
            setEmailError('Please enter a valid email address.');
            setError('Please provide a valid email.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            setSuccessMessage('');

            const formData = new FormData();
            formData.append('imageId', imageId);
            formData.append('categoryId', categoryId);
            formData.append('name', trimmedName);
            formData.append('email', trimmedEmail);
            formData.append('message', trimmedMessage);

            if (file) {
                formData.append('image', file);
            }

            const res = await fetch(`${apiUrl}/api/images/report`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to report image');
            }

            setSuccessMessage(data.message || 'Image reported successfully');

            if (onSuccess) {
                onSuccess(data);
            }

            setTimeout(() => {
                setReportDialog({ active: false, item: null });
            }, 800);
        } catch (err) {
            setError(err.message || 'Failed to report image');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={reportDialog.active} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Report Image</DialogTitle>
            <DialogContent>

                <Box sx={{ display: 'grid', gap: 1.5 }}>
                    <Typography variant="body2">
                        <strong>Image:</strong> {reportDialog.item?.fileName || 'Unknown'}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Category:</strong> {reportDialog.item?.category || 'Unknown'}
                    </Typography>

                    <TextField
                        label="Name"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formValues.email}
                        onChange={handleInputChange}
                        error={Boolean(emailError)}
                        helperText={emailError || ' '}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Message"
                        name="message"
                        value={formValues.message}
                        onChange={handleInputChange}
                        required
                        fullWidth
                        multiline
                        minRows={3}
                    />

                    <Button variant="outlined" component="label" color={file ? 'success' : 'primary'}>
                        {file ? 'Change Supporting Image (Optional)' : 'Upload Supporting Image (Optional)'}
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>

                    {file && (
                        <Typography variant="caption" sx={{ color: '#475569' }}>
                            Selected file: {file.name}
                        </Typography>
                    )}

                    {error && <Alert severity="error">{error}</Alert>}
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ReportDialog;