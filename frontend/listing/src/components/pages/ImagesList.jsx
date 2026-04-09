import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { DEFAULT_CATEGORY } from './AdminUpload';
import ImageCard from '../common/ImageCard';
import AdDialog from '../common/AdDialog';
const apiUrl = import.meta.env.VITE_BASE_URL;

function ImagesList() {
    const [allImages, setAllImages] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openAd, setOpenAd] = useState({ imageId: null, active: false });
    const openAdRef = useRef(openAd);
    const hasTrackedCurrentModalRef = useRef(false);


    console.log("openAd ",openAd);

    useEffect(() => {
        openAdRef.current = openAd;
    }, [openAd]);

    useEffect(() => {
        if (openAd.active && openAd.imageId) {
            hasTrackedCurrentModalRef.current = false;
        }
    }, [openAd.active, openAd.imageId]);
    

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

    // You can listen to events like:
    useEffect(() => {
        const onImpressionViewable = async () => {
            const { imageId, active } = openAdRef.current;

            if (!active || !imageId || hasTrackedCurrentModalRef.current) {
                return;
            }

            hasTrackedCurrentModalRef.current = true;

            console.log("Ad is visible");

            // Start timer for reward logic
            // setTimeout(() => {
            //     setCanDownload(true);
            // }, 3000);

            console.log("Add completed--- ", openAdRef.current);
            // call the download api here
            await handleImageStats(imageId, "isDownload");
        };

        window.googletag.pubads().addEventListener("impressionViewable", onImpressionViewable);

        return () => {
            window.googletag.pubads().removeEventListener("impressionViewable", onImpressionViewable);
        };
    }, [handleImageStats]);

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

            {/* Ads Dialog */}
            <AdDialog openAd={openAd} setOpenAd={setOpenAd} />

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
                        <ImageCard item={item} onAction={handleImageStats} setOpenAd={setOpenAd} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ImagesList;
