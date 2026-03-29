import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setSession(JSON.parse(user));
    }
  }, []);
  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
      {/* Hero Section */}
      <div className="max-w-6xl w-full mx-auto text-center mt-10 md:mt-20">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm">
          <span className="text-[13px] font-bold text-[#4F75FF] tracking-wider uppercase">
            Smart Commute Ecosystem
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-[900] tracking-tight text-[#333a4f] mb-6 leading-tight">
          Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F75FF] to-[#A259FF]">Bus Pass</span> Verification
        </h1>
        
        <p className="text-lg md:text-xl text-[#6b7280] font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          Experience seamless commuting with our advanced digital pass system. 
          Instant verification, real-time tracking, and effortless renewals all in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          {session ? (
            <Link 
              to={session.role === 'student' ? "/student/dashboard" : "/coordinator/scanner"}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl shadow-[0_8px_20px_-6px_rgba(79,117,255,0.6)] text-[15px] font-extrabold text-white bg-gradient-to-r from-[#4F75FF] to-[#A259FF] hover:from-[#3e60e0] hover:to-[#8c4ae6] transition-all transform hover:-translate-y-1"
            >
              Return to Dashboard
            </Link>
          ) : (
            <Link 
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl shadow-[0_8px_20px_-6px_rgba(79,117,255,0.6)] text-[15px] font-extrabold text-white bg-gradient-to-r from-[#4F75FF] to-[#A259FF] hover:from-[#3e60e0] hover:to-[#8c4ae6] transition-all transform hover:-translate-y-1"
            >
              Access Portal
            </Link>
          )}
          <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 text-[15px] font-extrabold text-[#4b5563] hover:text-[#4F75FF] shadow-sm transition-all transform hover:-translate-y-1">
            Explore Features
          </a>
        </div>
      </div>

      {/* Features Cards */}
      <div id="features" className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        {/* Card 1 */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 hover:shadow-[0_15px_50px_-15px_rgba(79,117,255,0.15)] transition-all duration-300">
          <div className="h-14 w-14 rounded-2xl bg-[#4F75FF]/10 flex items-center justify-center mb-6">
             <svg className="w-7 h-7 text-[#4F75FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
             </svg>
          </div>
          <h3 className="text-xl font-bold text-[#333a4f] mb-3">Instant QR Verification</h3>
          <p className="text-[#6b7280] font-medium leading-relaxed text-[15px]">
            Generate and scan dynamic QR codes for lightning-fast boarding and highly secure validations.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 hover:shadow-[0_15px_50px_-15px_rgba(162,89,255,0.15)] transition-all duration-300 transform md:-translate-y-4">
          <div className="h-14 w-14 rounded-2xl bg-[#A259FF]/10 flex items-center justify-center mb-6">
             <svg className="w-7 h-7 text-[#A259FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <h3 className="text-xl font-bold text-[#333a4f] mb-3">Real-time Dashboard</h3>
          <p className="text-[#6b7280] font-medium leading-relaxed text-[15px]">
            Keep track of your pass validity, upcoming renewals, and comprehensive travel history in one glance.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 hover:shadow-[0_15px_50px_-15px_rgba(79,117,255,0.15)] transition-all duration-300">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#4F75FF]/10 to-[#A259FF]/10 flex items-center justify-center mb-6">
             <svg className="w-7 h-7 text-[#4F75FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>
          </div>
          <h3 className="text-xl font-bold text-[#333a4f] mb-3">Military-Grade Security</h3>
          <p className="text-[#6b7280] font-medium leading-relaxed text-[15px]">
            Advanced encryption ensures your personal data and payment information are always protected.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-6xl w-full mx-auto pb-24 mt-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-[900] text-[#333a4f] mb-4">How It Works</h2>
          <p className="text-[#6b7280] font-medium max-w-2xl mx-auto">A seamless 3-step process designed for maximum security and rapid boarding flow.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative px-4">
          <div className="flex flex-col items-center text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-3xl font-[900] text-[#4F75FF] border border-gray-100 mb-6 transform hover:-translate-y-2 transition-transform">1</div>
            <h3 className="text-xl font-bold text-[#333a4f] mb-3">Secure Login</h3>
            <p className="text-[#6b7280] font-medium">Log into the Student Portal using your valid issued University Registration ID to hydrate your dynamic session.</p>
          </div>
          
          <div className="flex flex-col items-center text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-3xl font-[900] text-[#A259FF] border border-gray-100 mb-6 transform hover:-translate-y-2 transition-transform">2</div>
            <h3 className="text-xl font-bold text-[#333a4f] mb-3">Generate E-Pass</h3>
            <p className="text-[#6b7280] font-medium">Instantly encrypt your trip details into a highly secure, time-sensitive single-use active QR credential format.</p>
          </div>
          
          <div className="flex flex-col items-center text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-3xl font-[900] text-transparent bg-clip-text bg-gradient-to-r from-[#4F75FF] to-[#A259FF] border border-gray-100 mb-6 transform hover:-translate-y-2 transition-transform">3</div>
            <h3 className="text-xl font-bold text-[#333a4f] mb-3">Instant Scan</h3>
            <p className="text-[#6b7280] font-medium">Present your screen to the Boarding Coordinator for an instant localized encrypted 1-second onboard verification sweep.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
