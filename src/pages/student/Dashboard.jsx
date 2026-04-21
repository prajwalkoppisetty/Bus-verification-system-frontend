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

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const progressPercentage = Math.max(0, Math.min(100, (daysLeft / 30) * 100));
  const isPassActive = daysLeft > 0;
  const statusTone = daysLeft <= 3 ? 'critical' : daysLeft <= 7 ? 'warning' : 'normal';
  const studentName = user?.name || 'Student';
  const firstName = studentName.split(' ')[0] || 'Student';

  return (
    <div className="relative min-h-screen pt-28 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[#4f75ff]/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-24 right-0 h-80 w-80 rounded-full bg-[#ff9966]/15 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#8dd8ff]/20 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <section className="rounded-[2.2rem] border border-white/60 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_70px_-25px_rgba(30,41,59,0.25)]">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-[#7f8799] font-bold">{greeting}</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-[#1f2a44]">
                Welcome Back, <span className="text-[#325eff]">{firstName}</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#5f6678] font-medium max-w-xl">
                Track your bus pass health, boarding readiness, and renewals from one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold tracking-wide border ${
                isPassActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                <span className={`h-2 w-2 rounded-full ${isPassActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                {isPassActive ? 'Pass Active' : 'Pass Inactive'}
              </span>
              <button className="px-5 py-2.5 rounded-xl text-[14px] font-bold text-white bg-[#325eff] shadow-[0_12px_24px_-10px_rgba(50,94,255,0.55)] hover:bg-[#254ce0] transition-all hover:-translate-y-0.5">
                Renew Pass
              </button>
              <button className="px-5 py-2.5 rounded-xl text-[14px] font-bold text-[#2f3a5f] bg-white border border-[#d8ddf0] hover:bg-[#f6f8ff] transition-all">
                Download Pass
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-3xl bg-white/80 border border-white/70 p-5 shadow-[0_15px_35px_-20px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b93a7] font-bold">Pass Health</p>
            <p className="mt-3 text-3xl font-black text-[#253158]">{daysLeft}</p>
            <p className="text-sm text-[#606a82] font-semibold">Days Remaining</p>
          </div>
          <div className="rounded-3xl bg-white/80 border border-white/70 p-5 shadow-[0_15px_35px_-20px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b93a7] font-bold">Route</p>
            <p className="mt-3 text-xl font-black text-[#253158]">{user?.busRoute || 'Not Assigned'}</p>
            <p className="text-sm text-[#606a82] font-semibold">Allocated Bus Route</p>
          </div>
          <div className="rounded-3xl bg-white/80 border border-white/70 p-5 shadow-[0_15px_35px_-20px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b93a7] font-bold">Boarding Readiness</p>
            <p className="mt-3 text-xl font-black text-[#253158]">{isPassActive ? 'Ready' : 'Blocked'}</p>
            <p className="text-sm text-[#606a82] font-semibold">Live Validation Status</p>
          </div>
          <div className="rounded-3xl bg-white/80 border border-white/70 p-5 shadow-[0_15px_35px_-20px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b93a7] font-bold">Student ID</p>
            <p className="mt-3 text-lg font-black text-[#253158]">{user?.regNumber || 'Unavailable'}</p>
            <p className="text-sm text-[#606a82] font-semibold">Registered Enrollment</p>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-4xl bg-white/85 border border-white/80 p-6 sm:p-8 shadow-[0_20px_70px_-30px_rgba(23,31,56,0.4)] relative overflow-hidden">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#325eff]/15 blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs tracking-[0.18em] uppercase text-[#8a93a8] font-bold">Digital Bus Pass</p>
                  <h2 className="text-2xl font-black tracking-tight text-[#1f2a44] mt-2">Monthly Student Access</h2>
                </div>
                <span className="text-[11px] font-extrabold tracking-wider px-3 py-1.5 rounded-full bg-[#f2f5ff] text-[#325eff] border border-[#dce3ff]">
                  Secure QR Enabled
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-2xl bg-linear-to-br from-[#f4f7ff] to-[#eef2ff] border border-[#e0e6ff] p-5 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-xl mb-3 flex items-center justify-center border-2 border-dashed border-[#b7c7ff]">
                    <svg className="w-12 h-12 text-[#7f95ec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-xs font-extrabold tracking-wider text-[#4b5f9b]">SCAN AT BOARDING GATE</p>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-4 content-start">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#8b93a7] font-bold">Student Name</p>
                    <p className="mt-1 text-[15px] font-bold text-[#202b4a]">{studentName}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#8b93a7] font-bold">Registration No</p>
                    <p className="mt-1 text-[15px] font-bold text-[#202b4a]">{user?.regNumber || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#8b93a7] font-bold">Route Number</p>
                    <p className="mt-1 text-[15px] font-bold text-[#202b4a]">{user?.busRoute || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#8b93a7] font-bold">Expires On</p>
                    <p className="mt-1 text-[15px] font-bold text-[#ff5d5d]">{formatDate(user?.passValidUntil)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-[#8b93a7] font-bold">Cycle Progress</p>
                  <p className="text-sm font-extrabold text-[#43507a]">{daysLeft} days left</p>
                </div>
                <div className="w-full bg-[#ecf0ff] rounded-full h-3 overflow-hidden">
                  <div className="bg-linear-to-r from-[#325eff] via-[#5d7dff] to-[#89a3ff] h-3 rounded-full transition-all duration-700" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`rounded-3xl p-6 shadow-lg text-white relative overflow-hidden ${
              statusTone === 'critical'
                ? 'bg-linear-to-br from-red-500 to-rose-600'
                : statusTone === 'warning'
                  ? 'bg-linear-to-br from-[#ff8a38] to-[#ff5e62]'
                  : 'bg-linear-to-br from-[#2f66ff] to-[#3f89ff]'
            }`}>
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl -mr-12 -mt-10 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="font-black text-xl mb-1">
                  {statusTone === 'critical' ? 'Immediate Renewal Needed' : statusTone === 'warning' ? 'Renewal Reminder' : 'Pass Status Healthy'}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  {statusTone === 'critical'
                    ? `Your pass is about to expire in ${daysLeft} day(s). Renew today to avoid boarding denial.`
                    : statusTone === 'warning'
                      ? `Your pass expires in ${daysLeft} days. Plan your renewal to prevent interruption.`
                      : `You have ${daysLeft} days remaining. Your boarding access is currently in good standing.`}
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/80 border border-white/70 p-6 shadow-[0_15px_35px_-20px_rgba(0,0,0,0.35)]">
              <h3 className="text-[15px] font-black text-[#26314f] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="rounded-2xl border border-[#dce3ff] bg-[#f5f7ff] p-4 text-left hover:bg-[#eef2ff] transition-colors">
                  <p className="text-xs font-extrabold text-[#325eff] uppercase tracking-wider">Upgrade</p>
                  <p className="text-[13px] text-[#5c6785] font-semibold mt-1">Move to premium pass</p>
                </button>
                <button className="rounded-2xl border border-[#ffe0d5] bg-[#fff4ef] p-4 text-left hover:bg-[#ffece2] transition-colors">
                  <p className="text-xs font-extrabold text-[#ff6f42] uppercase tracking-wider">Support</p>
                  <p className="text-[13px] text-[#7e6458] font-semibold mt-1">Report an issue</p>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_15px_35px_-20px_rgba(0,0,0,0.35)]">
            <h3 className="text-lg font-black text-[#26314f]">Weekly Boarding Window</h3>
            <p className="text-sm font-medium text-[#6a738b] mt-1">Recommended time slots for smoother boarding.</p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-[#f4f7ff] border border-[#dce3ff] px-4 py-3">
                <p className="font-bold text-[#32426a]">Morning Slot</p>
                <p className="text-sm font-bold text-[#325eff]">7:30 AM - 8:00 AM</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#fff8ef] border border-[#ffe5c6] px-4 py-3">
                <p className="font-bold text-[#624d2f]">Afternoon Slot</p>
                <p className="text-sm font-bold text-[#ff9c3f]">3:40 PM - 4:10 PM</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#eefaf7] border border-[#cfeee4] px-4 py-3">
                <p className="font-bold text-[#315c52]">Evening Slot</p>
                <p className="text-sm font-bold text-[#2ea889]">5:15 PM - 5:45 PM</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_15px_35px_-20px_rgba(0,0,0,0.35)]">
            <h3 className="text-lg font-black text-[#26314f]">Reminders</h3>
            <p className="text-sm font-medium text-[#6a738b] mt-1">Stay prepared for uninterrupted travel.</p>
            <ul className="mt-5 space-y-3 text-sm text-[#475372] font-semibold">
              <li className="rounded-2xl bg-[#f8f9ff] border border-[#e8ecff] px-4 py-3">Carry your college ID for random checks at boarding points.</li>
              <li className="rounded-2xl bg-[#f8f9ff] border border-[#e8ecff] px-4 py-3">Take a screenshot of your QR in case of low network conditions.</li>
              <li className="rounded-2xl bg-[#f8f9ff] border border-[#e8ecff] px-4 py-3">Renew at least 2 days before expiry to avoid queue delays.</li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
