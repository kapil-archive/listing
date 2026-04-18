import React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ReportIcon from '@mui/icons-material/Report';


const ImageCard = React.memo(({ item, onAction, setOpenAd, onReport, onPreview }) => {
    return (
        <Card sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(15, 23, 42, 0.08)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {item.thumbUrl && (
                <CardMedia
                    component="img"
                    height="220"
                    image={item.thumbUrl}
                    alt={item.fileName || 'uploaded image'}
                    onClick={() => onPreview?.(item)}
                    sx={{ width: '100%', height: 220, objectFit: 'cover', flexShrink: 0, cursor: 'pointer' }}
                />
            )}
            <CardContent sx={{ pt: 1.5, px: 2, pb: 0, minWidth: 0 }}>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 600,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4,
                    }}
                >
                    {item.fileName || 'Untitled'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 0, flexWrap: 'wrap' }}>
                    <Chip label={item.category} size="small" sx={{ backgroundColor: '#ecfeff', color: '#155e75' }} />
                </Stack>
            </CardContent>
            <CardActions sx={{ px: 2, pt: 0, pb: 1, mt: 2, minHeight: 50 }}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                            aria-label="add to favorites"
                            size="small"
                            sx={{ p: 0.5 }}
                            onClick={() => onAction(item._id, "isLiked")}
                        >
                            <FavoriteIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                            {item.favouriteCount || 0} Likes
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                            aria-label="download"
                            size="small"
                            sx={{ p: 0.5 }}
                            onClick={() => setOpenAd(prev => ({ ...prev, imageId: item._id, active: true }))}
                        >
                            <FileDownloadIcon fontSize="small" />
                        </IconButton>
                        {/* <IconButton aria-label="download" onClick={() => onAction(item._id, "isDownload")}>
                            <FileDownloadIcon />
                        </IconButton> */}
                        <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                            {item.downloadCount || 0} Download
                        </Typography>
                    </Box>

                    <Box sx={{ ml: 'auto' }}>
                        <IconButton aria-label="report image" size="small" sx={{ p: 0.5 }} onClick={() => onReport(item)}>
                            <ReportIcon fontSize="small" color={"inherit"}/>
                        </IconButton>
                    </Box>
                </Box>
            </CardActions>
        </Card>
    );
});

export default ImageCard;