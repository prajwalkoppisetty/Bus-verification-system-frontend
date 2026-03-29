import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../utils/Logo.png';

const Navbar = ({ isLoggedIn, userRole, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const studentLinks = [
    { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Dashboard', path: '/student/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z' },
    { name: 'Generate Pass', path: '/student/generate-pass', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' },
    { name: 'History', path: '/student/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const coordinatorLinks = [
    { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Scanner', path: '/coordinator/scanner', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' },
    { name: 'History', path: '/coordinator/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const currentLinks = userRole === 'coordinator' ? coordinatorLinks : studentLinks;

  return (
    <nav className="fixed w-full z-50 top-0 bg-white/70 backdrop-blur-md border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={Logo} 
                alt="System Logo" 
                className="h-14 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-[20px] tracking-wide text-[#3F66FF] uppercase leading-none">
                  Bus<span className="text-[#333a4f]"> Pass</span>
                </span>
                <span className="font-bold text-[10px] tracking-[0.2em] text-[#9ca3af] uppercase mt-1">
                  Verification Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu - Minimalist grey typography matching the image */}
          <div className="hidden md:flex  flex-1 items-center justify-center space-x-10">
            {currentLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-[20px] font-semibold tracking-wide transition-colors duration-200 flex items-center gap-2 ${
                    isActive ? 'text-[#3F66FF]' : 'text-[#4b5563] hover:text-[#3F66FF]'
                  }`
                }
              >
                <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={link.icon} />
                </svg>
                {link.name}
              </NavLink>
            ))}
          </div>


          <div className="hidden md:flex items-center space-x-6">
             {isLoggedIn ? (
               <div className="flex items-center gap-4">
                 <div className="hidden lg:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#4F75FF] to-[#A259FF] flex items-center justify-center text-white text-[10px] font-bold">
                       {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-[13px] font-[900] text-[#333a4f] capitalize tracking-tight pr-1">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                 </div>
                 <button 
                   onClick={() => {
                     onLogout();
                     navigate('/login');
                   }}
                   className="text-[13px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100"
                 >
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                 </button>
               </div>
             ) : (
               <Link 
                 to="/login" 
                 className="text-[14px] font-bold text-[#4b5563] hover:text-[#3F66FF] transition-colors flex items-center gap-2"
               >
                  <svg className="w-[18px] h-[18px] opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Sign In
               </Link>
             )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-[#4F75FF]"
            >
              <svg className="block h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white/90 backdrop-blur-xl ${isOpen ? 'max-h-96 border-b border-gray-100' : 'max-h-0'}`}>
        <div className="px-6 pt-2 pb-6 space-y-4 shadow-inner">
           {currentLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${
                    isActive ? 'bg-[#3F66FF]/10 text-[#3F66FF]' : 'text-[#4b5563] hover:bg-gray-50 hover:text-[#3F66FF]'
                  }`
                }
              >
                <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={link.icon} />
                </svg>
                {link.name}
              </NavLink>
            ))}
            <div className="h-px bg-gray-200/60 my-4"></div>
            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center w-full px-4 py-3 text-[15px] font-[900] text-[#333a4f] bg-gray-50 rounded-xl shadow-sm border border-gray-100 gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#4F75FF] to-[#A259FF] flex items-center justify-center text-white text-[11px] font-bold">
                       {user?.name?.charAt(0) || 'U'}
                    </div>
                    {user?.name || 'User'}
                </div>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                    navigate('/login');
                  }}
                  className="flex justify-center w-full px-4 py-3 text-[15px] font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 rounded-xl shadow-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex justify-center w-full px-4 py-3 text-[15px] font-bold text-white bg-[#3F66FF] rounded-xl shadow-md"
              >
                Sign In
              </Link>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
