import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { DEFAULT_CATEGORY } from './AdminUpload';
const apiUrl = import.meta.env.VITE_BASE_URL;

function ImagesList() {
    const [allImages, setAllImages] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${apiUrl}/api/images`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to fetch images');
                }

                const fetchedImages = data.data || [];
                setAllImages(fetchedImages);
                setImages(fetchedImages);
            } catch (err) {
                setError(err.message || 'Failed to fetch images');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const handleClick = (categoryName) => {
        setSelectedCategory(categoryName);

        if (categoryName === 'All') {
            setImages(allImages);
            return;
        }

        const filteredImages = allImages.filter((image) =>
            image.category?.toLowerCase() === categoryName.toLowerCase()
        );
        setImages(filteredImages);
    }

    return (
        <Box sx={{ p: { xs: 1, md: 2 } }}>
            <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700, marginBottom: 2 }}>
                All Categories
            </Typography>
        
            <div>
                <Chip
                    key="all"
                    label="All"
                    size="medium"
                    sx={{
                        mr: 1,
                        mb: 1,
                        backgroundColor: selectedCategory === 'All' ? '#0369a1' : '#f0f9ff',
                        color: selectedCategory === 'All' ? '#ffffff' : '#0369a1',
                    }}
                    onClick={() => handleClick('All')}
                />
                {
                    DEFAULT_CATEGORY.map((cat) => (
                        <Chip
                            key={cat.id}
                            label={cat.name}
                            size="medium"
                            sx={{
                                mr: 1,
                                mb: 1,
                                backgroundColor: selectedCategory === cat.name ? '#0369a1' : '#f0f9ff',
                                color: selectedCategory === cat.name ? '#ffffff' : '#0369a1',
                            }}
                            onClick={() => handleClick(cat.name)}
                        />
                    ))  
                }
            </div>

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
                                
                            </CardContent>
                            <CardActions>
                                <IconButton aria-label="add to favorites">
                                    <FavoriteIcon />
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                                <IconButton aria-label="download">
                                    <FileDownloadIcon />
                                </IconButton>
                                
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ImagesList;
