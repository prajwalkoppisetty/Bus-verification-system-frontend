import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import apiClient from '../../services/api';

const CoordinatorScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3);
  const [todaysBoarded, setTodaysBoarded] = useState([]);

  useEffect(() => {
    let timer;
    if (!isScanning) {
      setTimeLeft(3);
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsScanning(true);
            setScanResult(null);
            setIsValid(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isScanning]);

  useEffect(() => {
    loadTodayScans();
  }, []);

  const loadTodayScans = () => {
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Filter only Verified passes for today
    const verifiedToday = history.filter(item => {
      const itemDate = item.rawDate ? new Date(item.rawDate).toISOString().split('T')[0] : '';
      return itemDate === todayStr && item.status === 'Verified';
    });
    
    // Ensure only unique boarded members are shown. Since history is unshifted (newest first),
    // mapping and keeping the first occurrence retains their latest successful scan today.
    const uniqueMap = new Map();
    verifiedToday.forEach(item => {
      const key = item.studentId || item.studentName;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });

    setTodaysBoarded(Array.from(uniqueMap.values()));
  };

  const processScan = async (result) => {
    try {
      let text = result;
      // Handle @yudiel/react-qr-scanner format variations
      if (Array.isArray(result) && result.length > 0) {
        text = result[0].rawValue;
      } else if (typeof result === 'object' && result?.text) {
        text = result.text;
      }
      
      const data = JSON.parse(text);
      if (data && data.passid) {
        setIsScanning(false);
        setScanResult({ ...data, error: null }); // Show data instantly while verifying

        try {
          const response = await apiClient.post(
             '/scans/verify',
             { qrId: data.passid }
          );
          
          setIsValid(true);
          // DEFENSE AGAINST SPOOFING: We completely ignore whatever string they encrypt in the QR 
          // other than the PassID. We strictly map their display UI to the MongoDB record.
          const dbStudent = response.data.student;
          const trustedData = {
              ...data,
              studentname: dbStudent.name,
              studentid: dbStudent.regNumber,
              bus_route: dbStudent.busRoute || data.bus_route,
              error: null
          };
          setScanResult(trustedData);
          recordHistory(trustedData, true);
          
        } catch (error) {
          setIsValid(false);
          const errorMsg = error.response ? error.response.data.message : "Network Database Error";
          setScanResult({ ...data, error: errorMsg });
          recordHistory(data, false);
        }
      }
    } catch (err) {
      // Not a valid JSON or not our QR
      setIsScanning(false);
      setScanResult({ error: "Invalid QR Code Structure" });
      setIsValid(false);
    }
  };

  const recordHistory = (data, valid) => {
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    const now = new Date();
    
    // Format: 02 Oct, 2023 - 08:35 AM
    const optionsDate = { day: '2-digit', month: 'short', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dateStr = now.toLocaleDateString('en-GB', optionsDate);
    const timeStr = now.toLocaleTimeString('en-US', optionsTime);
    
    const newEntry = {
      id: `SCN-${Math.floor(1000 + Math.random() * 9000)}`,
      route: data.bus_route || 'Unknown Route',
      datetime: `${dateStr} - ${timeStr}`,
      rawDate: now.toISOString(), // for filtering
      location: 'Coordinator Device',
      status: valid ? 'Verified' : 'Failed',
      studentName: data.studentname || 'Unknown',
      studentId: data.studentid || 'Unknown' // Track unique ID natively
    };

    history.unshift(newEntry);
    localStorage.setItem('scanHistory', JSON.stringify(history));

    // Instantly update the list if it's verified
    if (valid) {
      loadTodayScans();
    }
  };


  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-[900] tracking-tight text-[#333a4f]">Pass Scanner</h1>
          <p className="text-[#6b7280] font-medium mt-2">
            Scan student QR codes to verify their bus pass validity in real-time.
          </p>
        </div>

        {/* Scanner / Result Area */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] border border-white/60 relative overflow-hidden">
           
           {isScanning ? (
             <div className="flex flex-col items-center">
                <div className="w-full max-w-sm aspect-square bg-black rounded-3xl overflow-hidden shadow-inner relative border-4 border-gray-100 mb-6">
                  {/* Scanner Component Placeholder or Actual Scanner */}
                  <Scanner 
                     onScan={(result) => processScan(result)}
                     onError={(error) => console.log(error?.message)}
                     formats={['qr_code']}
                  />
                  {/* Overlay scanning line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#4F75FF]/70 shadow-[0_0_15px_5px_rgba(79,117,255,0.4)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>

             </div>
           ) : (
             <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                {/* Result Status Header */}
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${isValid ? 'bg-green-100 text-green-500 shadow-green-500/20' : 'bg-red-100 text-red-500 shadow-red-500/20'}`}>
                  {isValid ? (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>

                <h2 className={`text-3xl font-[900] mb-2 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {isValid ? 'APPROVED' : 'NOT APPROVED'}
                </h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-8">
                  {isValid ? 'VALID PASS' : 'INVALID PASS'}
                </p>

                {/* Scanned Details */}
                {scanResult && !scanResult.error && (
                  <div className="w-full bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left grid grid-cols-2 gap-y-5 gap-x-4 mb-8">
                     <div className="col-span-2 text-center pb-4 border-b border-gray-200">
                       <h3 className="text-xl font-bold text-[#333a4f]">{scanResult.studentname}</h3>
                       <p className="text-[#4b5563] font-bold text-sm mt-1">{scanResult.studentid} • {scanResult.branch}</p>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Route</span>
                       <span className="text-[14px] font-bold text-[#333a4f]">{scanResult.bus_route}</span>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pass ID</span>
                       <span className="text-[14px] font-bold text-[#333a4f]">{scanResult.passid}</span>
                     </div>
                     <div>
                       <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Valid Until</span>
                       <span className="text-[14px] font-bold text-[#333a4f]">{scanResult.due_date}</span>
                     </div>
                  </div>
                )}

                {scanResult?.error && (
                  <div className="w-full bg-red-50 rounded-2xl p-6 border border-red-100 text-center mb-6">
                    <p className="font-bold text-red-600">{scanResult.error}</p>
                  </div>
                )}

                <div className="w-full px-8 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-center">
                  <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                    Ready for next scan in {timeLeft}s...
                  </span>
                </div>
             </div>
           )}

        </div>

        {/* Boarding Counter & List Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] border border-white/60 relative overflow-hidden mt-8">
           
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 mb-6">
              <div>
                <h2 className="text-2xl font-[900] text-[#333a4f]">Live Boarding List</h2>
                <p className="text-[#6b7280] font-medium text-[14px] mt-1">Passengers verified for the current trip</p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center bg-[#4F75FF]/10 px-5 py-3 rounded-2xl border border-[#4F75FF]/20">
                <div className="w-10 h-10 rounded-full bg-[#4F75FF]/20 flex items-center justify-center mr-3">
                   <svg className="w-5 h-5 text-[#4F75FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                   </svg>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-[#4F75FF] uppercase tracking-widest leading-none mb-1">Total Boarded</span>
                  <span className="block text-2xl font-[900] text-[#333a4f] leading-none">{todaysBoarded.length}</span>
                </div>
              </div>
           </div>

           {todaysBoarded.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-bold text-gray-500">No passengers boarded yet</h3>
                <p className="text-[13px] text-gray-400 font-medium">Scan a valid pass to start tracking</p>
              </div>
           ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-[#6b7280] text-[11px] uppercase tracking-widest font-bold border-b border-gray-100">
                      <th className="px-5 py-4">Student</th>
                      <th className="px-5 py-4">Route</th>
                      <th className="px-5 py-4">Boarding Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/60">
                    {todaysBoarded.map((passenger, idx) => (
                      <tr key={idx} className="hover:bg-[#4F75FF]/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <span className="block text-[14px] font-bold text-[#333a4f]">{passenger.studentName}</span>
                          <span className="block text-[12px] text-gray-500 font-medium">{passenger.studentId || passenger.id}</span>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-medium text-[#4b5563]">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200">
                            {passenger.route}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-bold text-gray-600">
                           {passenger.datetime.split(' - ')[1]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           )}

        </div>
      </div>
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(350px); }
        }
      `}</style>
    </div>
  );
};

export default CoordinatorScanner;
