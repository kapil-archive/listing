import React from "react";
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ImageCard = React.memo(({ item, onAction }) => {
    return (
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
                </Stack>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={6} sm={6} md={6} display="flex" justifyContent="flex-start">
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <IconButton aria-label="add to favorites" onClick={() => onAction(item._id, "isLiked")}>
                                <FavoriteIcon />
                            </IconButton>
                            <Typography variant="caption">
                                {item.favouriteCount || 0} Likes
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={6} md={6} display="flex" justifyContent="flex-end">
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <IconButton aria-label="download" onClick={() => onAction(item._id, "isDownload")}>
                                <FileDownloadIcon />
                            </IconButton>
                            <Typography variant="caption">
                                {item.downloadCount || 0} Download
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
});

export default ImageCard;