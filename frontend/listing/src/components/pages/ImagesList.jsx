import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Portal from '@mui/material/Portal';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DEFAULT_CATEGORY } from './category.constants';
import ImageCard from '../common/ImageCard';
import AdDialog from '../common/AdDialog';
import ReportDialog from '../common/ReportDialog';
import { downloadBase64Image } from '../common/utils';
import Button from '@mui/material/Button';
import { useSearchParams } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_BASE_URL;
const PAGE_WINDOW_SIZE = 10;

function ImagesList() {
    const [allImages, setAllImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openAd, setOpenAd] = useState({ imageId: null, active: false });
    const [reportDialog, setReportDialog] = useState({ active: false, item: null });
    const [previewDialog, setPreviewDialog] = useState({ open: false, imageUrl: '', title: '' });
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const selectedCategory = searchParams.get('category') || 'All';
    const openAdRef = useRef(openAd);
    const hasTrackedCurrentModalRef = useRef(false);
    const previousFilterKeyRef = useRef(`${searchQuery}::${selectedCategory}`);
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
        const nextFilterKey = `${searchQuery}::${selectedCategory}`;

        if (previousFilterKeyRef.current !== nextFilterKey && pageDetail.currentPage !== 1) {
            previousFilterKeyRef.current = nextFilterKey;
            setPageDetail((prev) => ({ ...prev, currentPage: 1 }));
            return;
        }

        previousFilterKeyRef.current = nextFilterKey;

        const fetchImages = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                params.set('page', pageDetail.currentPage);
                params.set('limit', 10);
                if (searchQuery.trim()) {
                    params.set('search', searchQuery.trim());
                }
                if (selectedCategory && selectedCategory !== 'All') {
                    params.set('category', selectedCategory);
                }
                const res = await fetch(`${apiUrl}/api/images?${params}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to fetch images');
                }

                const fetchedImages = data.data || [];
                const { currentPage, totalPages } = data || {};
                setPageDetail({ currentPage: currentPage || 1, totalPages: totalPages || 1 });
                setAllImages(fetchedImages);
            } catch (err) {
                setError(err.message || 'Failed to fetch images');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [pageDetail.currentPage, searchQuery, selectedCategory]);

    const handlePageWindowClick = useCallback((windowDirection) => {
        setPageDetail((prev) => {
            const currentWindowStart = Math.floor((prev.currentPage - 1) / PAGE_WINDOW_SIZE) * PAGE_WINDOW_SIZE + 1;
            const nextWindowStart = currentWindowStart + (windowDirection * PAGE_WINDOW_SIZE);
            const boundedNextWindowStart = Math.max(1, Math.min(nextWindowStart, prev.totalPages));

            if (boundedNextWindowStart === currentWindowStart) {
                return prev;
            }

            return { ...prev, currentPage: boundedNextWindowStart };
        });
    }, []);

    const handlePageNumberClick = useCallback((pageNumber) => {
        setPageDetail((prev) => {
            if (pageNumber < 1 || pageNumber > prev.totalPages || pageNumber === prev.currentPage) {
                return prev;
            }
            return { ...prev, currentPage: pageNumber };
        });
    }, []);

    const visiblePageNumbers = useMemo(() => {
        const totalPages = pageDetail.totalPages || 1;
        const currentPage = pageDetail.currentPage || 1;
        const startPage = Math.floor((currentPage - 1) / PAGE_WINDOW_SIZE) * PAGE_WINDOW_SIZE + 1;
        const endPage = Math.min(startPage + PAGE_WINDOW_SIZE - 1, totalPages);

        return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    }, [pageDetail.currentPage, pageDetail.totalPages]);

    const hasPreviousWindow = useMemo(() => visiblePageNumbers[0] > 1, [visiblePageNumbers]);
    const hasNextWindow = useMemo(
        () => visiblePageNumbers[visiblePageNumbers.length - 1] < pageDetail.totalPages,
        [visiblePageNumbers, pageDetail.totalPages]
    );

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

            setAllImages((prevImages) =>
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

    const handleImageStatsRef = useRef(handleImageStats);

    useEffect(() => {
        handleImageStatsRef.current = handleImageStats;
    }, [handleImageStats]);

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
            const data = await handleImageStatsRef.current(imageId, "isDownload");
            if (data?.originalImage) {
                downloadBase64Image(data.originalImage, `${imageId}.jpg`);
            }
        };

        window.googletag.pubads().addEventListener("impressionViewable", onImpressionViewable);

        return () => {
            window.googletag.pubads().removeEventListener("impressionViewable", onImpressionViewable);
        };
    }, []);

    const visibleImages = useMemo(() => allImages, [allImages]);

    const handleCategoryChange = useCallback((e) => {
        const nextValue = e.target.value;
        const nextParams = new URLSearchParams(searchParams);

        if (nextValue && nextValue !== 'All') {
            nextParams.set('category', nextValue);
        } else {
            nextParams.delete('category');
        }

        setSearchParams(nextParams);
        setPageDetail({ currentPage: 1, totalPages: 1 });
    }, [searchParams, setSearchParams]);

    const handleReportClick = useCallback((item) => {
        setReportDialog({ active: true, item });
    }, []);

    const handlePreviewClick = useCallback((item) => {
        if (item?.thumbUrl) {
            setPreviewDialog({ open: true, imageUrl: item.thumbUrl, title: item.fileName || 'Preview' });
        }
    }, []);

    const handleClosePreview = useCallback(() => {
        setPreviewDialog({ open: false, imageUrl: '', title: '' });
    }, []);

    return (
        <Box sx={{ p: { xs: 1, md: 2 }, pb: { xs: 14, md: 12 } }}>
            {/* <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700, marginBottom: 2, textAlign: 'center' }}>
                All Categories
            </Typography> */}

            {/* Ads Dialog */}
            <AdDialog openAd={openAd} setOpenAd={setOpenAd} />
            <ReportDialog
                reportDialog={reportDialog}
                setReportDialog={setReportDialog}
                onSuccess={() => setError('')}
            />

            <Box
                sx={{
                    mb: 2.5,
                    px: { xs: 0.5, md: 0 },
                    py: 1,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(248,250,252,0.96) 0%, rgba(240,249,255,0.96) 100%)',
                    border: '1px solid rgba(14, 116, 144, 0.1)',
                    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.05)',
                }}
            >
               
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        px: 1,
                        overflowX: 'auto',
                        pb: 0.25,
                        '&::-webkit-scrollbar': {
                            height: 6,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(14, 116, 144, 0.18)',
                            borderRadius: 999,
                        },
                    }}
                >
                    {DEFAULT_CATEGORY.map((cat) => {
                        const isActive = selectedCategory === cat.name;

                        return (
                            <Button
                                key={cat.id}
                                variant={isActive ? 'contained' : 'outlined'}
                                onClick={() => handleCategoryChange({ target: { value: cat.name } })}
                                sx={{
                                    flexShrink: 0,
                                    px: 2,
                                    py: 0.9,
                                    borderRadius: 999,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    color: isActive ? '#ffffff' : '#0f172a',
                                    borderColor: isActive ? 'transparent' : 'rgba(14, 116, 144, 0.18)',
                                    background: isActive
                                        ? 'linear-gradient(135deg, #0f766e 0%, #0369a1 100%)'
                                        : 'rgba(255, 255, 255, 0.88)',
                                    boxShadow: isActive
                                        ? '0 12px 22px rgba(3, 105, 161, 0.2)'
                                        : 'none',
                                    '&:hover': {
                                        borderColor: isActive ? 'transparent' : 'rgba(14, 116, 144, 0.32)',
                                        background: isActive
                                            ? 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)'
                                            : 'rgba(240, 249, 255, 0.98)',
                                    },
                                }}
                            >
                                {cat.name}
                            </Button>
                        );
                    })}
                </Stack>
            </Box>

            {loading && <Typography>Loading images...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && !error && visibleImages.length === 0 && (
                <Typography>No images uploaded yet.</Typography>
            )}

            <Box
                sx={{
                    mt: 1,
                    display: 'grid',
                    gap: { xs: 1.5, sm: 2 },
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                        xl: 'repeat(5, 1fr)',
                    },
                    justifyItems: 'center',
                }}
            >
                {visibleImages.map((item) => (
                    <Box
                        key={item._id}
                        sx={{
                            width: '100%',
                            maxWidth: 360,
                        }}
                    >
                        <ImageCard
                            item={item}
                            onAction={handleImageStats}
                            setOpenAd={setOpenAd}
                            onReport={handleReportClick}
                            onPreview={handlePreviewClick}
                        />
                    </Box>
                ))}
            </Box>
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2000,
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        borderTop: '1px solid #e5e7eb',
                        boxShadow: '0 -8px 20px rgba(15, 23, 42, 0.08)',
                        px: { xs: 1, md: 2 },
                        py: 1,
                    }}
                >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Button variant="contained" color="primary" onClick={() => handlePageWindowClick(-1)} disabled={!hasPreviousWindow}>
                            Previous
                        </Button>

                        {visiblePageNumbers.map((pageNumber) => (
                            <Button
                                key={pageNumber}
                                variant={pageDetail.currentPage === pageNumber ? 'contained' : 'outlined'}
                                color="primary"
                                onClick={() => handlePageNumberClick(pageNumber)}
                                sx={{ minWidth: 40 }}
                                size='small'
                            >
                                {pageNumber}
                            </Button>
                        ))}

                        <Button variant="contained" color="primary" onClick={() => handlePageWindowClick(1)} disabled={!hasNextWindow}>
                            Next
                        </Button>
                        <Typography variant="body2" sx={{ color: '#6b7280', width: '100%', textAlign: 'center' }}>
                            Page {pageDetail.currentPage} of {pageDetail.totalPages}
                        </Typography>
                    </Box>
                </Box>
            <Dialog open={previewDialog.open} onClose={handleClosePreview} maxWidth="md" fullWidth>
                <DialogTitle>{previewDialog.title}</DialogTitle>
                <DialogContent sx={{ p: 0, textAlign: 'center' }}>
                    {previewDialog.imageUrl ? (
                        <Box
                            component="img"
                            src={previewDialog.imageUrl}
                            alt={previewDialog.title}
                            sx={{ width: '100%', maxHeight: '75vh', objectFit: 'contain' }}
                        />
                    ) : (
                        <Typography sx={{ p: 3 }}>No preview available.</Typography>
                    )}
                </DialogContent>
            </Dialog>
            <Portal>
            </Portal>
        </Box>
    );
}

export default ImagesList;
