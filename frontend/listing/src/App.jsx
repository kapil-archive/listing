
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import AdminUpload from './components/pages/AdminUpload';
import ImagesList from './components/pages/ImagesList';
import AppHeader from './components/common/AppHeader';

function App() {
  return (
    <BrowserRouter>
      <Box className="app-start">
        <AppHeader />
        <Box className="shell">
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
