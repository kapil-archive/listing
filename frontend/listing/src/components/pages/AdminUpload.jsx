import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { DEFAULT_CATEGORY } from './category.constants';

function AdminUpload() {
    const navigate = useNavigate();

    const [category, setCategory] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file || !category) {
            alert('Please select category and image');
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('image', file);
            formData.append('categoryName', category);

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/images/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            alert('Image uploaded successfully');
            setFile(null);
            setPreview(null);
            setCategory('');
        } catch (error) {
            alert(error.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="main">
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.08)',
                    background: 'linear-gradient(180deg, #fff8f0 0%, #ffffff 65%)',
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
                    Admin Image Upload
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5, mb: 2.5, textAlign: 'center' }}>
                    Choose a category, select an image, and publish it to the gallery.
                </Typography>

                <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
                    <Button variant="text" onClick={() => navigate('/admin/blocked-images')}>
                        View Blocked Images
                    </Button>
                </Stack>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6} flexGrow={1}>
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
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{ p: 2, borderColor: '#f97316', color: '#c2410c' }}
                        >
                            Choose Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ p: 2, backgroundColor: '#0f766e' }}
                            onClick={handleUpload}
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                    </Grid>
                </Grid>

                {preview && (
                    <Box
                        sx={{
                            mt: 3,
                            pt: 2,
                            borderTop: '1px solid rgba(0,0,0,0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="subtitle1">Preview</Typography>
                        <Box
                            component="img"
                            src={preview}
                            alt="preview"
                            sx={{
                                mt: 1,
                                width: '100%',
                                height: 320,
                                objectFit: 'contain',
                                borderRadius: 2,
                                backgroundColor: '#f8fafc',
                                border: '1px solid rgba(15, 23, 42, 0.08)',
                            }}
                        />
                    </Box>
                )}
            </Paper>
        </Box>
    );
}

export default AdminUpload;
