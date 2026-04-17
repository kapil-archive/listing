
import './App.css';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import AdminPanel from './components/pages/AdminPanel';
import AdminUpload from './components/pages/AdminUpload';
import ImagesList from './components/pages/ImagesList';
import FillForm from './components/pages/FillForm';
import BlockedImages from './components/pages/BlockedImages';
import Login from './components/pages/Login';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsAndConditions from './components/pages/TermsAndConditions';
import AppHeader from './components/common/AppHeader';
import AppFooter from './components/common/AppFooter';

function PublicLayout() {
  return (
    <Box className="app-start">
      <AppHeader />
      <Box className="shell">
        <Box className="page-container">
          <Outlet />
        </Box>
      </Box>
      <AppFooter />
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/images" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/images" element={<ImagesList />} />
          <Route path="/fill-form" element={<FillForm />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Route>
        <Route path="/admin" element={<AdminPanel />}>
          <Route index element={<AdminUpload />} />
          <Route path="blocked-images" element={<BlockedImages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
