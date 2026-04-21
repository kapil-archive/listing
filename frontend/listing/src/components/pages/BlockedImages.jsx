import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, getAuthToken } from '../common/utils';

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
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    imageUrl: '',
    title: '',
  });
  const [messageDialog, setMessageDialog] = useState({
    open: false,
    message: '',
    reporter: '',
  });
  const [originalDialog, setOriginalDialog] = useState({
    open: false,
    imageUrl: '',
    title: '',
  });
  const [originalLoadingId, setOriginalLoadingId] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const normalizedQuery = searchInput.trim();
      setSearchQuery(normalizedQuery);
      setPageDetail((prev) => (prev.currentPage === 1 ? prev : { ...prev, currentPage: 1 }));
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      clearAuthSession();
      navigate('/login');
      return;
    }

    const fetchBlockedImages = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: String(pageDetail.currentPage),
          limit: '9',
        });

        if (searchQuery) {
          queryParams.set('search', searchQuery);
        }

        const res = await fetch(`${apiUrl}/api/images/blocked?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.status === 401 || res.status === 403) {
          clearAuthSession();
          navigate('/login');
          return;
        }

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
  }, [pageDetail.currentPage, searchQuery, navigate]);

  const handlePageChange = (direction) => {
    setPageDetail((prev) => {
      const nextPage = prev.currentPage + direction;
      if (nextPage < 1 || nextPage > prev.totalPages) {
        return prev;
      }
      return { ...prev, currentPage: nextPage };
    });
  };

  const handleOpenPreview = (item) => {
    if (!item?.reportImageUrl) {
      return;
    }

    setPreviewDialog({
      open: true,
      imageUrl: item.reportImageUrl,
      title: item.fileName || 'Preview image',
    });
  };

  const handleClosePreview = () => {
    setPreviewDialog({ open: false, imageUrl: '', title: '' });
  };

  const handleOpenMessage = (item) => {
    setMessageDialog({
      open: true,
      message: item?.message || '-',
      reporter: item?.name || 'Unknown reporter',
    });
  };

  const handleCloseMessage = () => {
    setMessageDialog({ open: false, message: '', reporter: '' });
  };

  const handleOpenOriginal = async (item) => {
    if (!item?.imageId) {
      setError('Invalid image id for original preview.');
      return;
    }

    try {
      setOriginalLoadingId(item.imageId);
      setError('');

      const token = getAuthToken();
      if (!token) {
        clearAuthSession();
        navigate('/login');
        return;
      }

      const res = await fetch(`${apiUrl}/api/images/${item.imageId}/original`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        clearAuthSession();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch original image');
      }

      setOriginalDialog({
        open: true,
        imageUrl: data?.data?.originalImage || '',
        title: data?.data?.fileName || item.fileName || 'Original image',
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch original image');
    } finally {
      setOriginalLoadingId('');
    }
  };

  const handleCloseOriginal = () => {
    setOriginalDialog({ open: false, imageUrl: '', title: '' });
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          border: '1px solid rgba(30, 64, 175, 0.2)',
          background: 'linear-gradient(140deg, #0f172a 0%, #1e293b 55%, #1d4ed8 100%)',
          color: '#e2e8f0',
          mb: 2,
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <ShieldRoundedIcon sx={{ color: '#93c5fd' }} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Moderation Queue
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
              Review all blocked image reports in a centralized admin table.
            </Typography>
          </Box>
          <Chip label={`${pageDetail.total} report(s)`} sx={{ backgroundColor: 'rgba(148, 163, 184, 0.16)', color: '#e2e8f0', fontWeight: 700 }} />
        </Stack>
      </Paper>

      {loading && <Alert severity="info">Loading blocked images...</Alert>}
      {!loading && error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && items.length === 0 && <Alert severity="warning">No blocked images found.</Alert>}

      <Paper elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)', borderRadius: 2, overflow: 'hidden', mt: 2 }}>
        <Box sx={{ px: 2, py: 1.5, backgroundColor: '#f8fafc' }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
            useFlexGap
            flexWrap="wrap"
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                Blocked Images Table
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Includes reporter details, message, and linked image metadata.
              </Typography>
            </Box>

            <TextField
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by reporter name, email, or message"
              variant="outlined"
              size="small"
              sx={{
                width: { xs: '100%', md: 360 },
                maxWidth: '100%',
                flexShrink: 0,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  '&:hover fieldset': {
                    borderColor: '#0369a1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0369a1',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" sx={{ color: '#0369a1' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Box>
        <Divider />
        <TableContainer sx={{ maxHeight: '68vh' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Preview</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>File</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Reporter</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Image ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Reported On</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow hover key={item.reportId}>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={item.reportImageUrl || null}
                      alt={item.fileName || 'report image'}
                      onClick={() => handleOpenPreview(item)}
                      sx={{ width: 46, height: 46, border: '1px solid rgba(15, 23, 42, 0.1)' }}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 170 }}>{item.fileName || 'Supporting image'}</TableCell>
                  <TableCell>{item.name || '-'}</TableCell>
                  <TableCell sx={{ minWidth: 190 }}>{item.email || '-'}</TableCell>
                  <TableCell sx={{ minWidth: 240, maxWidth: 320 }}>
                    <Typography
                      variant="body2"
                      onClick={() => handleOpenMessage(item)}
                      sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer'}}
                      title="Click to view full message"
                    >
                      {item.message || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.category || '-'}</TableCell>
                  <TableCell sx={{ maxWidth: 180 }}>
                    <Typography variant="caption" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }} title={item.imageId || ''}>
                      {item.imageId || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 180 }}>
                    <Typography variant="caption" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }} title={item.categoryId || ''}>
                      {item.categoryId || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 160 }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenOriginal(item)}
                      disabled={originalLoadingId === item.imageId}
                    >
                      {originalLoadingId === item.imageId ? 'Loading...' : 'View Original'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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

      <Dialog open={previewDialog.open} onClose={handleClosePreview} fullWidth maxWidth="md">
        <DialogTitle>{previewDialog.title}</DialogTitle>
        <DialogContent>
          {previewDialog.imageUrl ? (
            <Box
              component="img"
              src={previewDialog.imageUrl}
              alt={previewDialog.title || 'report preview image'}
              sx={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 1 }}
            />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={messageDialog.open} onClose={handleCloseMessage} fullWidth maxWidth="sm">
        <DialogTitle>Reported Message</DialogTitle>
        <DialogContent sx={{ overflowX: 'hidden' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#475569' }}>
            Reporter: {messageDialog.reporter}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              maxWidth: '100%',
            }}
          >
            {messageDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessage}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={originalDialog.open} onClose={handleCloseOriginal} fullWidth maxWidth="md">
        <DialogTitle>{originalDialog.title || 'Original image'}</DialogTitle>
        <DialogContent>
          {originalDialog.imageUrl ? (
            <Box
              component="img"
              src={originalDialog.imageUrl}
              alt={originalDialog.title || 'original image'}
              sx={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 1 }}
            />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOriginal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BlockedImages;
