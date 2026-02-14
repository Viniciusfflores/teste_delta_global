import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StudentProvider } from './contexts/StudentContext';
import { LoginPage } from './pages/Login';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StudentProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </StudentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;