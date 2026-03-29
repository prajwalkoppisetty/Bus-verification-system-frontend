import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
       try {
         const response = await apiClient.get('/scans/history');
         setHistoryData(response.data);
         // backup to local storage just for other UI elements sync
         localStorage.setItem('scanHistory', JSON.stringify(response.data));
       } catch (err) {
         console.error("HISTORY SYNC ERROR:", err);
         const storedHistory = localStorage.getItem('scanHistory');
         if (storedHistory) setHistoryData(JSON.parse(storedHistory));
       } finally {
         setIsLoading(false);
       }
    };
    fetchHistory();
  }, []);

  const handleFilterChange = (e) => {
    setFilterDate(e.target.value);
  };

  const filteredHistory = historyData.filter(item => {
    if (!filterDate) return true;
    if (!item.rawDate) return true;
    const itemDate = new Date(item.rawDate).toISOString().split('T')[0];
    return itemDate === filterDate;
  });

  const handleDownloadExcel = () => {
    // Generate native CSV compatible perfectly with MS Excel
    const headers = ['Scan ID', 'Date & Time', 'Bus Route', 'Location', 'Student', 'Status'];
    const rows = filteredHistory.map(item => [
      item.id,
      `"${item.datetime}"`, // Quotes prevent comma collision
      `"${item.route}"`,
      `"${item.location}"`,
      `"${item.studentName || 'Unknown'}"`,
      item.status
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Scan_History_${filterDate || 'All_Dates'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-[900] tracking-tight text-[#333a4f]">Scan History</h1>
          <p className="text-[#6b7280] font-medium mt-1">Review the timestamps and locations of verified and failed QR validations.</p>
        </div>

        {/* History Table Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-white/60 overflow-hidden">
          
          <div className="p-6 border-b border-gray-100/50 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="relative w-full sm:w-72">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
               </div>
               <input 
                 type="text" 
                 className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F75FF]/20 focus:border-[#4F75FF] transition-all bg-white" 
                 placeholder="Search scans..." 
               />
             </div>
             
             <div className="flex flex-wrap gap-3 items-center mt-4 sm:mt-0 w-full sm:w-auto">
               
               <div className="relative flex-grow sm:flex-grow-0">
                 <input 
                   type="date" 
                   value={filterDate}
                   onChange={handleFilterChange}
                   className="block appearance-none w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs md:text-[13px] font-bold text-[#4b5563] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4F75FF]/20 focus:border-[#4F75FF] transition-all cursor-pointer"
                 />
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                 </div>
               </div>

               {filterDate && (
                 <button 
                   onClick={() => setFilterDate('')} 
                   className="px-3 py-2 border border-gray-200 rounded-xl text-xs md:text-[13px] font-bold text-red-500 bg-white hover:bg-red-50 transition-colors flex items-center shadow-sm"
                 >
                   Clear
                 </button>
               )}

               <button 
                 onClick={handleDownloadExcel}
                 className="px-4 py-2 border border-[#4F75FF]/30 rounded-xl text-xs md:text-[13px] font-bold text-white bg-[#4F75FF] hover:bg-[#3e60e0] transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
                 Export Excel
               </button>
               
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-[#6b7280] text-[12px] uppercase tracking-wider font-bold border-b border-gray-100">
                  <th className="px-4 md:px-6 py-3 md:py-4">Scan ID</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Date & Time</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Bus Route</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Location</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Student</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-4 md:px-6 py-10 text-center text-[#4F75FF] font-bold text-xs md:text-sm">
                       <svg className="animate-spin h-6 w-6 text-[#4F75FF] mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Syncing Secure Ledger...
                    </td>
                  </tr>
                ) : filteredHistory.length > 0 ? filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#4F75FF]/[0.02] transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-[14px] font-bold text-[#333a4f] whitespace-nowrap">{item.id}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-[14px] text-[#6b7280] whitespace-nowrap">{item.datetime}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-[14px] font-medium text-[#4b5563] whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <svg className="hidden md:block w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        {item.route}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-[14px] font-bold text-[#333a4f] whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <svg className="hidden md:block w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-[14px] font-bold text-gray-500 whitespace-nowrap">
                      {item.studentName || 'Alex Johnson'}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold gap-1.5 ${
                        item.status === 'Verified' 
                          ? 'bg-green-100/80 text-green-700 border border-green-200' 
                          : 'bg-red-100/80 text-red-700 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Verified' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-bold">
                      No scans physically found securely within the DB.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-gray-100/50 flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium ml-2">Showing {filteredHistory.length} scan(s)</span>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default History;
