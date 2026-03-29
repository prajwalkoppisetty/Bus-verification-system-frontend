import Navbar from './components/common/Navbar'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/common/Login'
import Home from './pages/Home'
import Dashboard from './pages/student/Dashboard'
import History from './pages/student/History'
import GeneratePass from './pages/student/GeneratePass'
import CoordinatorScanner from './pages/coordinator/CoordinatorScanner'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'student' or 'coordinator'

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
  }, []);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return (
        <div className="min-h-screen flex items-center justify-center pt-24 relative z-10 px-4">
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 text-center max-w-md w-full mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-[900] text-[#333a4f] mb-3">Access Restricted</h2>
            <p className="text-[#6b7280] font-medium mb-8 leading-relaxed">
              Please login to your account to view this page and access your personalised dashboard.
            </p>
            <Link 
              to="/login"
              className="inline-flex justify-center w-full px-6 py-3.5 rounded-2xl shadow-[0_8px_20px_-6px_rgba(79,117,255,0.6)] text-[15px] font-extrabold text-white bg-gradient-to-r from-[#4F75FF] to-[#A259FF] hover:from-[#3e60e0] hover:to-[#8c4ae6] transition-all transform hover:-translate-y-0.5"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      );
    }
    return children;
  };

  return(
    <>
    <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      
      {/* Student Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/student/generate-pass" element={<ProtectedRoute><GeneratePass /></ProtectedRoute>} />
      <Route path="/student/history" element={<ProtectedRoute><History /></ProtectedRoute>} />

      {/* Coordinator Routes */}
      <Route path="/coordinator/scanner" element={<ProtectedRoute><CoordinatorScanner /></ProtectedRoute>} />
      <Route path="/coordinator/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
    </Routes>
    </>
  )
}

export default App
