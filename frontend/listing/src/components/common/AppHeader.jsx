import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import InstallPWA from './InstallPWA';
import { DEFAULT_CATEGORY } from '../pages/category.constants';

const NAV_OPTIONS = [
  { label: 'Privacy and policy', path: '/privacy-policy' },
  { label: 'Terms and Conditions', path: '/terms-and-conditions' },
  { label: 'Contact US', path: '/fill-form' },
];

function AppHeader() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isImagesPage = location.pathname === '/images';
  const activeSearchQuery = useMemo(() => searchParams.get('search') || '', [searchParams]);
  const activeCategory = useMemo(() => searchParams.get('category') || 'All', [searchParams]);
  const hasExpandedFilters = Boolean(activeSearchQuery || activeCategory !== 'All');

  useEffect(() => {
    setSearchInput(activeSearchQuery);
    setSearchOpen(hasExpandedFilters);
  }, [activeSearchQuery, hasExpandedFilters, isImagesPage]);

  useEffect(() => {
    if (!isImagesPage) {
      setSearchOpen(false);
    }
  }, [isImagesPage]);

  const handleNavigate = (path) => {
    navigate(path);
    setOpenMobileMenu(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const applySearch = useCallback((value) => {
    const trimmedValue = value.trim();
    const nextParams = new URLSearchParams(searchParams);

    if (trimmedValue) {
      nextParams.set('search', trimmedValue);
    } else {
      nextParams.delete('search');
    }

    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  const handleCategoryChange = useCallback((event) => {
    const nextValue = event.target.value;
    const nextParams = new URLSearchParams(searchParams);

    if (nextValue && nextValue !== 'All') {
      nextParams.set('category', nextValue);
    } else {
      nextParams.delete('category');
    }

    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  const handleSearchToggle = useCallback(() => {
    if (!searchOpen) {
      setSearchOpen(true);
    }
  }, [searchOpen]);

  const handleSearchChange = useCallback((event) => {
    const nextValue = event.target.value;
    setSearchInput(nextValue);

    if (!nextValue.trim()) {
      applySearch(nextValue);
    }
  }, [applySearch]);

  const handleSearchSubmit = useCallback(() => {
    applySearch(searchInput);
  }, [applySearch, searchInput]);

  const handleSearchKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  }, [handleSearchSubmit]);

  const handleSearchButtonMouseDown = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchOpen(false);
  }, []);

  const searchField = isImagesPage ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: { xs: 'auto', md: searchOpen ? 260 : 'auto' },
        width: { xs: searchOpen ? '100%' : 'auto', md: searchOpen ? 260 : 'auto' },
        transition: 'width 0.25s ease, min-width 0.25s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: searchOpen ? '100%' : 'auto',
          border: searchOpen ? '1px solid rgba(3, 105, 161, 0.22)' : '1px solid transparent',
          borderRadius: 999,
          backgroundColor: searchOpen ? '#f0f9ff' : 'transparent',
          overflow: 'hidden',
          transition: 'all 0.25s ease',
        }}
      >
        {searchOpen ? (
          <>
            <InputBase
              autoFocus
              placeholder="Search images..."
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              sx={{
                flex: 1,
                px: 1.5,
                fontSize: 14,
              }}
            />
            <IconButton
              color="inherit"
              onMouseDown={handleSearchButtonMouseDown}
              onClick={handleSearchSubmit}
            >
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleSearchClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <IconButton color="inherit" onClick={handleSearchToggle}>
            <SearchIcon />
          </IconButton>
        )}
      </Box>

    </Box>
  ) : null;

  const categoryField = isImagesPage && searchOpen ? (
    <TextField
      select
      size="small"
      value={activeCategory}
      onChange={handleCategoryChange}
      sx={{
        minWidth: { xs: 120, md: 150 },
        '& .MuiOutlinedInput-root': {
          borderRadius: 999,
          backgroundColor: '#f0f9ff',
          '&:hover fieldset': { borderColor: '#0369a1' },
          '&.Mui-focused fieldset': { borderColor: '#0369a1' },
        },
      }}
    >
      {DEFAULT_CATEGORY.map((cat) => (
        <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
      ))}
    </TextField>
  ) : null;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          width: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
          color: '#0f172a',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ px: { xs: 1.5, md: 2 }, gap: 1 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => handleNavigate('/images')}
          >
            <CategoryRoundedIcon sx={{ color: '#0f766e' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.3 }}>
              Category Hub
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ display: { xs: 'none', md: 'flex' }, flexShrink: 0 }}
          >
            {categoryField}
            {searchField}
            {NAV_OPTIONS.map((item, index) => (
              <Button
                key={`${item.label}-${index}`}
                variant={isActivePath(item.path) ? 'contained' : 'text'}
                onClick={() => handleNavigate(item.path)}
                sx={{ borderRadius: 999 }}
              >
                {item.label}
              </Button>
            ))}
            <InstallPWA />
          </Stack>

          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ display: { xs: 'flex', md: 'none' }, flexShrink: 0, flexGrow: searchOpen ? 1 : 0 }}
          >
            {categoryField}
            {searchField}
            <InstallPWA />
            <IconButton color="inherit" onClick={() => setOpenMobileMenu(true)}>
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={openMobileMenu} onClose={() => setOpenMobileMenu(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Typography variant="subtitle1" sx={{ px: 2, pb: 1, fontWeight: 700 }}>
            Menu
          </Typography>
          <List>
            {NAV_OPTIONS.map((item, index) => (
              <ListItemButton
                key={`${item.label}-${index}`}
                selected={isActivePath(item.path)}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
            <ListItemButton onClick={() => handleNavigate('/login')}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default AppHeader;
