import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import MemeOfTheDayPage from './pages/MemeOfTheDayPage';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';
import MemeDetailPage from './pages/MemeDetailPage';
import UploadPage from './pages/UploadPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/meme-of-the-day" element={<MemeOfTheDayPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/memes/:id" element={<MemeDetailPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
