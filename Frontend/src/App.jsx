import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import Header from './components/Header/Header';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import RequireAuth from './components/Auth/RequireAuth';
import ChatHistoryPage from './pages/ChatHistoryPage';
import ResourceUsagePage from './pages/ResourceUsagePage';
import { getCookie } from './utils/cookieUtils';
import Footer from './components/Global/Footer';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getCookie('recall-token') ? setIsLoggedIn(true) : setIsLoggedIn(false);
  }, [isLoggedIn]);

  const setAuthStatus = (status) => {
    setIsLoggedIn(status);
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setAuthStatus={setAuthStatus} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth" element={<SignInPage setAuthStatus={setAuthStatus} />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<ChatHistoryPage />} />
          <Route path="/usage" element={<ResourceUsagePage />} />
        </Route>

        <Route path="/notfound" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/notfound" replace />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;