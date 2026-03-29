import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import apiClient from '../../services/api';

const GeneratePass = () => {
  const [passData, setPassData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

  useEffect(() => {
    // Check local storage on mount
    const savedPass = localStorage.getItem('studentPassData');
    const generatedAt = localStorage.getItem('qrGeneratedAt');

    if (savedPass && generatedAt) {
      const now = new Date().getTime();
      const timeElapsed = now - parseInt(generatedAt, 10);
      
      const parsedPass = JSON.parse(savedPass);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Force clear demo passes or passes from previous logins!
      if (parsedPass.studentid !== currentUser.regNumber) {
        localStorage.removeItem('studentPassData');
        localStorage.removeItem('qrGeneratedAt');
        setPassData(null);
        return;
      }

      if (timeElapsed < SIX_HOURS_MS) {
        setPassData(parsedPass);
        setTimeRemaining(SIX_HOURS_MS - timeElapsed);
      } else {
        // Expired, clear them
        localStorage.removeItem('studentPassData');
        localStorage.removeItem('qrGeneratedAt');
      }
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) {
            clearInterval(interval);
            localStorage.removeItem('studentPassData');
            localStorage.removeItem('qrGeneratedAt');
            setPassData(null);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeRemaining]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem('token');
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await apiClient.post(
        '/passes/generate',
        {}
      );
      
      const newPass = response.data.pass;
      const studentInfo = response.data.studentInfo;
      
      const dynamicData = {
        studentname: studentInfo.name,
        studentid: studentInfo.regNumber,
        branch: savedUser.branch || "Computer Science",
        passid: newPass.qrId,
        bus_route: studentInfo.busRoute,
        payment_date: new Date(newPass.generatedAt).toISOString().split('T')[0],
        due_date: new Date(newPass.expiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setPassData(dynamicData);
      
      // Calculate exact ms remaining securely from DB stamp
      const msRemaining = new Date(newPass.expiresAt).getTime() - new Date().getTime();
      setTimeRemaining(msRemaining > 0 ? msRemaining : 0);
      
      localStorage.setItem('studentPassData', JSON.stringify(dynamicData));
      localStorage.setItem('qrGeneratedAt', new Date(newPass.generatedAt).getTime().toString());
      
    } catch (error) {
       console.error("GENERATE ERROR:", error);
       if (error.response?.status === 400 && error.response.data.pass) {
         // Auto-recover active pass if they try generating on a new device
         const existingPass = error.response.data.pass;
         const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
         const dynamicData = {
            studentname: savedUser.name,
            studentid: savedUser.regNumber,
            branch: savedUser.branch || "Computer Science",
            passid: existingPass.qrId,
            bus_route: savedUser.busRoute,
            payment_date: new Date(existingPass.generatedAt).toISOString().split('T')[0],
            due_date: new Date(existingPass.expiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
         };
         setPassData(dynamicData);
         const msRemaining = new Date(existingPass.expiresAt).getTime() - new Date().getTime();
         setTimeRemaining(msRemaining > 0 ? msRemaining : 0);
         localStorage.setItem('studentPassData', JSON.stringify(dynamicData));
         localStorage.setItem('qrGeneratedAt', new Date(existingPass.generatedAt).getTime().toString());
       } else if (error.response) {
         setErrorMsg(error.response.data.message);
       } else {
         setErrorMsg("Network error contacting the secure generation server.");
       }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-[900] tracking-tight text-[#333a4f]">Generate E-Pass</h1>
          <p className="text-[#6b7280] font-medium mt-2 max-w-lg mx-auto">
            Generate your secure daily QR code pass. To prevent misuse, passes can only be generated once every 6 hours.
          </p>
        </div>

        {/* Generate Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] border border-white/60 relative overflow-hidden flex flex-col items-center">
            {/* Decorative background flair */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4F75FF]/10 to-[#A259FF]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

            {passData ? (
              <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-6 relative group">
                   <QRCodeSVG 
                     value={JSON.stringify(passData)} 
                     size={220} 
                     level="H"
                     includeMargin={false}
                     fgColor="#1f2937"
                   />
                   {/* Scanning animation line */}
                   <div className="absolute top-6 left-6 right-6 h-0.5 bg-[#4F75FF]/50 shadow-[0_0_8px_2px_rgba(79,117,255,0.4)] animate-[scan_3s_ease-in-out_infinite]"></div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-[900] text-[#333a4f] mb-1">{passData.studentname}</h3>
                  <p className="text-[#4b5563] font-bold text-sm tracking-widest uppercase mb-1">{passData.studentid} • {passData.branch}</p>
                  <p className="inline-flex mt-2 px-3 py-1 rounded-md bg-[#4F75FF]/10 text-[#4F75FF] text-sm font-bold border border-[#4F75FF]/20">
                    {passData.bus_route}
                  </p>
                </div>

                <div className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left grid grid-cols-2 gap-y-4 gap-x-2">
                   <div>
                     <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pass ID</span>
                     <span className="text-[14px] font-bold text-[#333a4f]">{passData.passid}</span>
                   </div>
                   <div>
                     <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Valid Until</span>
                     <span className="text-[14px] font-bold text-red-500">{passData.due_date}</span>
                   </div>
                   <div className="col-span-2">
                     <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center mt-2">Next generation available in</span>
                     <span className="block text-[18px] font-[900] text-[#A259FF] text-center mt-1 font-mono tracking-wider">{formatTime(timeRemaining)}</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="relative z-10 py-10 flex flex-col items-center">
                 <div className="w-24 h-24 bg-gradient-to-br from-[#4F75FF]/10 to-[#A259FF]/10 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-[#4F75FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                 </div>
                 <h2 className="text-2xl font-[900] text-[#333a4f] mb-3">Ready to Travel?</h2>
                 <p className="text-[#6b7280] font-medium mb-8 text-center max-w-sm">
                   Ensure you are at the bus stop before generating your pass. The pass is only valid for your designated route.
                 </p>
                 
                 {errorMsg && (
                   <div className="mb-6 p-4 w-full bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold flex items-start gap-3 text-left">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {errorMsg}
                   </div>
                 )}

                 <button 
                   onClick={handleGenerate}
                   disabled={isLoading}
                   className="w-full sm:w-auto px-10 py-4 rounded-2xl shadow-[0_8px_20px_-6px_rgba(79,117,255,0.6)] text-[16px] font-extrabold text-white bg-gradient-to-r from-[#4F75FF] to-[#A259FF] hover:from-[#3e60e0] hover:to-[#8c4ae6] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                 >
                   {isLoading ? (
                     <div className="flex items-center gap-3">
                       <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Encrypting Pass...
                     </div>
                   ) : (
                     <div className="flex items-center gap-3">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                       Generate E-Pass Now
                     </div>
                   )}
                 </button>
              </div>
            )}
        </div>
      </div>
    {/* CSS block for the scan animation */}
    <style>{`
      @keyframes scan {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(208px); }
      }
    `}</style>
    </div>
  );
};

export default GeneratePass;
