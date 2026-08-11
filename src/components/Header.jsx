import React from 'react';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-bold shadow-md">
          JD
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">JD vs Resume Check</h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-brand font-semibold bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        ATS Score
      </div>
    </header>
  );
}
