import { Routes, Route, Navigate } from 'react-router-dom';
import SignInForm from "./pages/SignInPage";
import HomePage from './pages/HomePage';

const App = () => {
  return (
  <Routes>
    <Route path="/" element={
        <SignInForm />
    } />
    <Route path="/home" element={<HomePage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
  );
};
export default App
