import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { DEFAULT_CATEGORY } from './AdminUpload';
import ImageCard from '../common/ImageCard';
import AdDialog from '../common/AdDialog';
import { downloadBase64Image } from '../common/utils';
import Button from '@mui/material/Button';
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
    const [pageDetail, setPageDetail] = useState({
        currentPage: 1,
        totalPages: 1,
    });


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
                const res = await fetch(`${apiUrl}/api/images?page=${pageDetail.currentPage}&limit=1`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to fetch images');
                }

                const fetchedImages = data.data || [];
                const { currentPage, totalPages } = data || {};
                setPageDetail({ currentPage: currentPage || 1, totalPages: totalPages || 1 });
                setAllImages(fetchedImages);
                setImages(fetchedImages);
            } catch (err) {
                setError(err.message || 'Failed to fetch images');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [pageDetail.currentPage]);

    const handlePageClick = (pageChange) => {
        setPageDetail((prev) => {
            const nextPage = prev.currentPage + pageChange;
            if (nextPage < 1 || nextPage > prev.totalPages) {
                return prev;
            }
            return { ...prev, currentPage: nextPage };
        });
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

            // Always return an object with originalImage field
            return { originalImage: data?.data?.originalImage ?? null };
        } catch (err) {
            setError(err.message);
            return { originalImage: null };
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

            console.log("Add completed--- ", openAdRef.current);
            // call the download api here
            const data = await handleImageStats(imageId, "isDownload");
            if (data?.originalImage) {
                downloadBase64Image(data.originalImage, `${imageId}.jpg`);
            }
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


            <Box sx={{ display: 'flex', justifyContent: 'center',alignItems:'center', mt: 4,gap:4 }}>

                <Button variant="contained" color="primary" onClick={() => handlePageClick(-1)} disabled={pageDetail.currentPage === 1}>
                    Previous
                </Button>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Page {pageDetail.currentPage} of {pageDetail.totalPages}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => handlePageClick(1)} disabled={pageDetail.currentPage === pageDetail.totalPages}>
                    Next
                </Button>

            </Box>
        </Box>
    );
}

export default ImagesList;
