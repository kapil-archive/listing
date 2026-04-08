import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { DEFAULT_CATEGORY } from './AdminUpload';
import ImageCard from '../common/ImageCard';
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

    const handleImageStats = useCallback(async (imageId, updateState) => {
        try {
            const body = {
                imageId,
                isLiked: false,
                isDownload: false,
            };

            body[updateState] = true;

            const res = await fetch(`${apiUrl}/api/images/updateStats`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setImages((prevImages) =>
                prevImages.map((img) =>
                    img._id === imageId ? { ...img, ...data.data } : img
                )
            );
        } catch (err) {
            setError(err.message);
        }
    }, []);

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
                        <ImageCard item={item} onAction={handleImageStats} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ImagesList;
