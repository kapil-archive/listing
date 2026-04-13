import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_BASE_URL;

function BlockedImages() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageDetail, setPageDetail] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchBlockedImages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/images/blocked?page=${pageDetail.currentPage}&limit=9`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch blocked images');
        }

        setItems(data.data || []);
        setPageDetail((prev) => ({
          ...prev,
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          total: data.total || 0,
        }));
      } catch (err) {
        setError(err.message || 'Failed to fetch blocked images');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedImages();
  }, [pageDetail.currentPage]);

  const handlePageChange = (direction) => {
    setPageDetail((prev) => {
      const nextPage = prev.currentPage + direction;
      if (nextPage < 1 || nextPage > prev.totalPages) {
        return prev;
      }
      return { ...prev, currentPage: nextPage };
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Blocked Images
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/admin')}>
          Back To Admin
        </Button>
      </Box>

      {loading && <Typography>Loading blocked images...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && items.length === 0 && (
        <Typography>No blocked images found.</Typography>
      )}

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.reportId}>
            <Card sx={{ height: '100%', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
              {item.reportImageUrl && (
                <CardMedia component="img" image={item.reportImageUrl} alt={item.fileName || 'blocked image'} sx={{ height: 220, objectFit: 'cover' }} />
              )}
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {item.fileName || 'Supporting image'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', mt: 0.5 }}>
                  Category: {item.category}
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  Image ID: {item.imageId}
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  Category ID: {item.categoryId}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1 }}>
                  Reported On: {new Date(item.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!loading && !error && pageDetail.total > 0 && (
        <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => handlePageChange(-1)} disabled={pageDetail.currentPage <= 1}>
            Previous
          </Button>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Page {pageDetail.currentPage} of {pageDetail.totalPages}
          </Typography>
          <Button variant="outlined" onClick={() => handlePageChange(1)} disabled={pageDetail.currentPage >= pageDetail.totalPages}>
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default BlockedImages;