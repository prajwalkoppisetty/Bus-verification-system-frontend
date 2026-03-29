import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import Logo from '../../utils/Logo.png';

const Login = ({ onLogin }) => {
  const [isStudent, setIsStudent] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Connect to backend via API client
      const response = await apiClient.post('/auth/login', {
        regNumber: identifier,
        password: password
      });

      const { token, user } = response.data;

      // Ensure the toggled role matches their actual DB role
      const expectedRole = isStudent ? 'student' : 'coordinator';
      if (user.role !== expectedRole) {
        setError(`Access denied. You are registered as a ${user.role}. Please use the correct tab.`);
        setIsLoading(false);
        return;
      }

      // Save session securely
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (onLogin) {
        onLogin(user.role);
      }

      if (user.role === 'student') {
        navigate('/student/generate-pass');
      } else {
        navigate('/coordinator/scanner');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server connection failed. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-[420px] w-full bg-white/95 backdrop-blur-3xl rounded-[2rem] shadow-[0_10px_60px_-15px_rgba(157,117,255,0.15)] overflow-hidden transition-all border border-white/50 p-10 sm:p-12">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            
            <h2 className="text-3xl font-[900] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#4F75FF] to-[#A259FF]">
              Sign In
            </h2>
          </div>
          <p className="text-[13px] text-[#6b7280] font-medium tracking-wide">
            Welcome back to <span className="font-bold text-[#4F75FF]">Bus Pass Verification Portal</span>
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Subtle Role Toggle */}
          <div className="flex bg-[#f3f4f6]/60 p-1 rounded-xl w-full mx-auto relative mb-6">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-out border border-gray-100 ${
                isStudent ? 'translate-x-0' : 'translate-x-full'
              }`}
            ></div>
            <button 
              type="button" onClick={() => { setIsStudent(true); setError(''); }}
              className={`relative z-10 w-1/2 py-2 text-[13px] font-bold rounded-lg transition-colors duration-300 ${isStudent ? 'text-[#333a4f]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Student
            </button>
            <button 
              type="button" onClick={() => { setIsStudent(false); setError(''); }}
              className={`relative z-10 w-1/2 py-2 text-[13px] font-bold rounded-lg transition-colors duration-300 ${!isStudent ? 'text-[#333a4f]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Co-ordinator
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-[13px] font-bold p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[13px] font-bold text-[#333a4f] mb-1.5 ml-1">
              {isStudent ? 'Registration Number' : 'Co-ordinator ID'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-[18px] w-[18px] text-[#A259FF]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isStudent ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  )}
                </svg>
              </div>
              <input 
                type="text" required 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl text-[#1f2937] bg-white focus:outline-none focus:ring-[3px] focus:ring-[#4F75FF]/20 focus:border-[#4F75FF] transition-all text-[14px] font-medium placeholder:text-gray-400 shadow-sm" 
                placeholder={isStudent ? 'REG NO (10 characters)' : 'CO-Ordinator ID'} 
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-[13px] font-bold text-[#333a4f] mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-[18px] w-[18px] text-[#4F75FF]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                type="password" required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-12 py-3 border border-gray-200 rounded-2xl text-[#1f2937] bg-white focus:outline-none focus:ring-[3px] focus:ring-[#4F75FF]/20 focus:border-[#4F75FF] transition-all text-[14px] font-medium placeholder:text-gray-400 shadow-sm" 
                placeholder="Enter your password" 
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full flex justify-center py-3.5 px-4 mt-8 rounded-2xl shadow-[0_8px_20px_-6px_rgba(79,117,255,0.6)] text-[15px] font-extrabold text-white transition-all transform flex items-center gap-2 ${isLoading ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed scale-100' : 'bg-gradient-to-r from-[#4F75FF] to-[#A259FF] hover:from-[#3e60e0] hover:to-[#8c4ae6] focus:outline-none focus:ring-4 focus:ring-[#A259FF]/30 hover:scale-[1.01] active:scale-[0.98]'}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Sign In"}
          </button>
        </form>
        

       
        

        
      </div>
    </div>
  );
};

export default Login;