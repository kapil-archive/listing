
import './App.css';
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AdminUpload from './components/pages/AdminUpload';
import ImagesList from './components/pages/ImagesList';
import InstallPWA from './components/common/InstallPWA';

function App() {
  return (
    <BrowserRouter>
      <Box className="app-start">
        <Box className="shell">

          <Box className="page-container">
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <InstallPWA />
            </div>
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
