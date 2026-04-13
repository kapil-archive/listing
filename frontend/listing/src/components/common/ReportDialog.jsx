import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

const apiUrl = import.meta.env.VITE_BASE_URL;

function ReportDialog({ reportDialog, setReportDialog, onSuccess }) {
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!reportDialog.active) {
            setFile(null);
            setSubmitting(false);
            setError('');
            setSuccessMessage('');
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

    const handleSubmit = async () => {
        const imageId = reportDialog.item?.imageId || reportDialog.item?._id;
        const categoryId = reportDialog.item?.categoryId;

        if (!imageId || !categoryId) {
            setError('Missing image or category details.');
            return;
        }

        if (!file) {
            setError('Supporting image is required.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            setSuccessMessage('');

            const formData = new FormData();
            formData.append('imageId', imageId);
            formData.append('categoryId', categoryId);
            formData.append('image', file);

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

                    <Button variant="outlined" component="label" color={file ? 'success' : 'primary'}>
                        {file ? 'Change Supporting Image' : 'Upload Supporting Image'}
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