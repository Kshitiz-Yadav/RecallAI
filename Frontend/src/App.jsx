import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import Header from './components/Header/Header';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import RequireAuth from './components/Auth/RequireAuth';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth" element={<SignInPage />} />
        
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        
        <Route path="/notfound" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/notfound" replace />} />
      </Routes>
    </>
  );
};

export default App;