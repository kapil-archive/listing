
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import AdminUpload from './components/pages/AdminUpload';
import ImagesList from './components/pages/ImagesList';
import FillForm from './components/pages/FillForm';
import BlockedImages from './components/pages/BlockedImages';
import AppHeader from './components/common/AppHeader';
import AppFooter from './components/common/AppFooter';

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
              <Route path="/admin/blocked-images" element={<BlockedImages />} />
              <Route path="/images" element={<ImagesList />} />
              <Route path="/fill-form" element={<FillForm />} />
            </Routes>
          </Box>
        </Box>
        <AppFooter />
      </Box>
    </BrowserRouter>
  );
}

export default App;
