import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_CATEGORY } from './category.constants';
import { getAuthToken } from '../common/utils';

function AdminUpload() {
    const navigate = useNavigate();

    const [category, setCategory] = useState('');
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setUploadStatus({ type: '', message: '' });
    };

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);
        previews.forEach((url) => URL.revokeObjectURL(url));
        setFiles(selectedFiles);
        setPreviews(selectedFiles.map((item) => URL.createObjectURL(item)));
        setUploadStatus({ type: '', message: '' });
    };

    const handleUpload = async () => {
        if (!files.length || !category) {
            setUploadStatus({ type: 'error', message: 'Please select category and at least one image before publishing.' });
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            files.forEach((file) => {
                formData.append('images', file);
            });
            formData.append('categoryName', category);

            const token = getAuthToken();
            if (!token) {
                navigate('/login');
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/images/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (res.status === 401 || res.status === 403) {
                navigate('/login');
                return;
            }

            if (!res.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            setUploadStatus({ type: 'success', message: `${files.length} image(s) uploaded and published successfully.` });
            previews.forEach((url) => URL.revokeObjectURL(url));
            setFiles([]);
            setPreviews([]);
            setCategory('');
        } catch (error) {
            setUploadStatus({ type: 'error', message: error.message || 'Upload failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="main">
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 3.5 },
                    borderRadius: 4,
                    border: '1px solid rgba(15, 23, 42, 0.12)',
                    background: 'linear-gradient(160deg, #f8fafc 0%, #ffffff 45%, #eef2ff 100%)',
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, md: 2.5 },
                        borderRadius: 3,
                        border: '1px solid rgba(30, 64, 175, 0.22)',
                        background: 'linear-gradient(140deg, #0f172a 0%, #1e293b 55%, #1d4ed8 100%)',
                        color: '#e2e8f0',
                        mb: 2,
                    }}
                >
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
                        <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                <AdminPanelSettingsRoundedIcon sx={{ color: '#93c5fd' }} />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    Admin Console
                                </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                                Manage gallery uploads and moderation actions from one control panel.
                            </Typography>
                        </Box>

                        <Chip
                            label="Upload Workspace"
                            sx={{
                                backgroundColor: 'rgba(148, 163, 184, 0.16)',
                                color: '#e2e8f0',
                                fontWeight: 700,
                            }}
                        />
                    </Stack>
                </Paper>

                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2.5, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CategoryRoundedIcon sx={{ color: '#0f766e' }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>Active Categories</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{DEFAULT_CATEGORY.length}</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2.5, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <ImageRoundedIcon sx={{ color: '#2563eb' }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>Selected Image</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{files.length ? `${files.length} Ready` : 'Not Selected'}</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2.5, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CategoryRoundedIcon sx={{ color: '#7c3aed' }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>Selected Category</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{category || 'Not Selected'}</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>

                {uploadStatus.message && (
                    <Alert severity={uploadStatus.type || 'info'} sx={{ mb: 2 }}>
                        {uploadStatus.message}
                    </Alert>
                )}

                <Divider sx={{ mb: 2 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Publish New Gallery Image
                    </Typography>
                    <Chip
                        label={loading ? 'Uploading...' : 'Ready'}
                        color={loading ? 'warning' : 'success'}
                        size="small"
                    />
                </Stack>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                        <FormControl fullWidth>
                            <InputLabel id="select-category-label">Category</InputLabel>
                            <Select
                                labelId="select-category-label"
                                value={category}
                                onChange={handleCategoryChange}
                                label="Category"
                            >
                                {DEFAULT_CATEGORY.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{
                                mt: 2,
                                p: 2.4,
                                borderStyle: 'dashed',
                                borderWidth: 2,
                                borderColor: files.length ? '#059669' : '#334155',
                                color: files.length ? '#047857' : '#1e293b',
                                backgroundColor: files.length ? '#ecfdf5' : '#f8fafc',
                                fontWeight: 700,
                                '&:hover': {
                                    borderColor: files.length ? '#047857' : '#0f172a',
                                    backgroundColor: files.length ? '#dcfce7' : '#f1f5f9',
                                },
                            }}
                        >
                            {files.length ? `Selected: ${files.length} image(s)` : 'Choose Image Files'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />
                        </Button>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 1.5,
                                p: 1.6,
                                background: 'linear-gradient(90deg, #0f766e 0%, #0891b2 100%)',
                                fontWeight: 800,
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #0d9488 0%, #0e7490 100%)',
                                },
                            }}
                            onClick={handleUpload}
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Publish Image'}
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                border: '1px solid rgba(15, 23, 42, 0.1)',
                                backgroundColor: '#ffffff',
                                minHeight: 260,
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 700, mb: 1 }}>
                                Preview
                            </Typography>

                            {previews.length ? (
                                <Grid container spacing={1}>
                                    {previews.slice(0, 6).map((url, index) => (
                                        <Grid item xs={6} key={`${url}-${index}`}>
                                            <Box
                                                component="img"
                                                src={url}
                                                alt={`preview-${index + 1}`}
                                                sx={{
                                                    width: '100%',
                                                    height: 120,
                                                    objectFit: 'cover',
                                                    borderRadius: 1.5,
                                                    border: '1px solid rgba(15, 23, 42, 0.08)',
                                                    backgroundColor: '#f8fafc',
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                    {previews.length > 6 && (
                                        <Grid item xs={12}>
                                            <Typography variant="caption" sx={{ color: '#475569' }}>
                                                +{previews.length - 6} more selected
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            ) : (
                                <Box
                                    sx={{
                                        height: 250,
                                        borderRadius: 1.5,
                                        border: '1px dashed rgba(15, 23, 42, 0.22)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#64748b',
                                        textAlign: 'center',
                                        px: 2,
                                    }}
                                >
                                    Select image files to see preview before publishing.
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default AdminUpload;
