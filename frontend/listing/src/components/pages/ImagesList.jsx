import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function ImagesList() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const res = await fetch('http://localhost:8081/api/images');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to fetch images');
                }

                setImages(data.data || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch images');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    return (
        <Box sx={{ p: { xs: 1, md: 2 } }}>
            <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700 }}>
                User Gallery
            </Typography>
            <Typography variant="body2" sx={{ mb: 2.5, color: '#6b7280' }}>
                Explore all uploaded images across categories.
            </Typography>

            {loading && <Typography>Loading images...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && !error && images.length === 0 && (
                <Typography>No images uploaded yet.</Typography>
            )}

            <Grid container spacing={2}>
                {images.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <Card sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
                            {item.imageUrl && (
                                <CardMedia
                                    component="img"
                                    height="220"
                                    image={item.imageUrl}
                                    alt={item.fileName || 'uploaded image'}
                                />
                            )}
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {item.fileName || 'Untitled'}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1.5, flexWrap: 'wrap' }}>
                                    <Chip label={item.category} size="small" sx={{ backgroundColor: '#ecfeff', color: '#155e75' }} />
                                    <Chip label={`${Math.round((item.size || 0) / 1024)} KB`} size="small" sx={{ backgroundColor: '#fff7ed', color: '#9a3412' }} />
                                </Stack>
                                <Typography variant="caption" color="text.secondary">
                                    Uploaded {new Date(item.createdAt).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ImagesList;
