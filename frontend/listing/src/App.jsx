
import './App.css';
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AdminUpload from './components/pages/AdminUpload';
import ImagesList from './components/pages/ImagesList';

function App() {
  return (
    <BrowserRouter>
      <Box className="app-start">
        <Box className="shell">
          {/* <Box className="topbar">
            <Typography variant="h5" className="brand-title">PixelVault</Typography>
            <Typography variant="body2" className="brand-subtitle">
              Admin upload and user gallery in separate routes
            </Typography>
            <Box className="nav-links">
              <NavLink to="/admin" className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}>
                Admin Panel
              </NavLink>
              <NavLink to="/images" className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}>
                User Gallery
              </NavLink>
            </Box>
          </Box> */}

          <Box className="page-container">
            <Routes>
              <Route path="/" element={<Navigate to="/images" replace />} />
              <Route path="/admin" element={<AdminUpload />} />
              <Route path="/images" element={<ImagesList />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
