import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      if (savedUser.passValidUntil) {
        const diffTime = new Date(savedUser.passValidUntil).getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays > 0 ? diffDays : 0);
      }
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const opts = { day: '2-digit', month: 'short', year: 'numeric'};
    return new Date(dateString).toLocaleDateString('en-GB', opts);
  };

  const progressPercentage = Math.max(0, Math.min(100, (daysLeft / 30) * 100));

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-[900] tracking-tight text-[#333a4f]">Student Dashboard</h1>
            <p className="text-[#6b7280] font-medium mt-1">Welcome back, <span className="text-[#4F75FF] font-bold">{user?.name || 'Student'}</span></p>
          </div>
          <button className="px-5 py-2.5 rounded-xl text-[14px] font-bold text-white bg-[#4F75FF] shadow-[0_4px_14px_0_rgba(79,117,255,0.39)] hover:shadow-[0_6px_20px_rgba(79,117,255,0.23)] hover:bg-[#3e60e0] transition-all transform hover:-translate-y-0.5">
            Renew Pass
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Pass Card */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] border border-white/60 relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4F75FF]/20 to-[#A259FF]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              {/* QR Code Placeholder Section */}
              <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="w-32 h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100/80 text-green-700 text-xs font-bold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                  ACTIVE PASS
                </div>
              </div>

              {/* Pass Details */}
              <div className="w-full md:w-2/3 flex flex-col justify-center">
                <div className="mb-6">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pass Type</h2>
                  <p className="text-2xl font-[900] text-[#333a4f]">Monthly Student Pass</p>
                </div>

                <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Registration No</h3>
                    <p className="text-[15px] font-semibold text-[#1f2937]">{user?.regNumber || 'Not available'}</p>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Route No</h3>
                    <p className="text-[15px] font-semibold text-[#1f2937]">{user?.busRoute || 'Not assigned'}</p>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Valid From</h3>
                    <p className="text-[15px] font-semibold text-[#1f2937]">{user ? "Active" : "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Expires On</h3>
                    <p className="text-[15px] font-semibold text-red-500">{formatDate(user?.passValidUntil)}</p>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#4F75FF] to-[#A259FF] h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <p className="text-right text-xs font-bold text-gray-500 mt-2">{daysLeft} days left</p>
              </div>
            </div>
          </div>

          {/* Side Info Cards */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/60">
              <h3 className="text-[15px] font-extrabold text-[#333a4f] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center bg-gray-50/80 hover:bg-[#4F75FF]/5 border border-gray-100 p-4 rounded-2xl transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-[#4F75FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-[12px] font-bold text-[#4b5563]">Upgrade</span>
                </button>
                <button className="flex flex-col items-center justify-center bg-gray-50/80 hover:bg-[#A259FF]/5 border border-gray-100 p-4 rounded-2xl transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-[#A259FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-[12px] font-bold text-[#4b5563]">Report Issue</span>
                </button>
              </div>
            </div>

            {/* Notification */}
            <div className={`bg-gradient-to-br from-[#4F75FF] to-[#3e60e0] rounded-3xl p-6 shadow-lg text-white relative overflow-hidden ${daysLeft < 7 ? 'from-red-500 to-pink-500' : ''}`}>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
               <div className="flex items-start gap-4 relative z-10">
                 <div className="bg-white/20 p-2 rounded-xl">
                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="font-bold mb-1">{daysLeft < 7 ? "Pass Expiring Soon" : "Pass Status Normal"}</h3>
                   <p className="text-white/80 text-[13px] leading-relaxed">
                     {daysLeft < 7 
                       ? `Your pass expires in ${daysLeft} days. Renew now to avoid late fees and travel interruptions.` 
                       : `You have ${daysLeft} days remaining on your active pass cycle.`
                     }
                   </p>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
