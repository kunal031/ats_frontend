import React, { useState, useRef } from 'react';

export default function InputSection({ onAnalyze }) {
  const [jobDescription, setJobDescription] = useState('');
  const [inputType, setInputType] = useState('csv'); // 'csv' or 'text'
  const [file, setFile] = useState(null);
  const [candidateText, setCandidateText] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!jobDescription) {
      alert("Please provide a Job Description");
      return;
    }
    if (inputType === 'csv' && !file) {
      alert("Please upload a CSV file");
      return;
    }
    if (inputType === 'text' && !candidateText.trim()) {
      alert("Please provide candidate text");
      return;
    }
    setIsCollapsed(true);
    onAnalyze(jobDescription, inputType === 'csv' ? file : null, inputType === 'text' ? candidateText : '');
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-6xl mx-auto transition-all">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Resume Data Side */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between items-center mb-1">
             <div 
               className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 -ml-2 rounded-md transition-colors"
               onClick={() => setIsCollapsed(!isCollapsed)}
               title={isCollapsed ? "Unhide Input Section" : "Hide Input Section"}
             >
               <h2 className="text-xl font-bold text-gray-800">Resume Data</h2>
               {isCollapsed ? (
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
               )}
             </div>
             {!isCollapsed && (
               <div className="bg-gray-100 p-1 rounded-lg text-sm font-medium text-gray-500 shadow-inner flex cursor-pointer">
                 <button 
                   onClick={() => setInputType('csv')}
                   className={`px-4 py-1.5 rounded-md transition-all ${inputType === 'csv' ? 'bg-white shadow-sm text-brand font-bold' : 'hover:text-gray-700'}`}
                 >
                   CSV
                 </button>
                 <button 
                   onClick={() => setInputType('text')}
                   className={`px-4 py-1.5 rounded-md transition-all ${inputType === 'text' ? 'bg-white shadow-sm text-brand font-bold' : 'hover:text-gray-700'}`}
                 >
                   Text
                 </button>
               </div>
             )}
          </div>
          
          {!isCollapsed && (
            inputType === 'csv' ? (
              <div 
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer h-72 ${file ? 'border-brand bg-indigo-50/50' : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".csv"
                  onChange={handleFileChange}
                />
                {!file ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>
                    <p className="font-semibold text-gray-700 text-lg">Drag and drop CSV here</p>
                    <p className="text-sm text-gray-500 mt-1 mb-6">or click to browse files</p>
                    <button className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-white hover:shadow-sm transition-all">
                      Choose File
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <p className="font-bold text-gray-800 text-lg mb-1">File Selected</p>
                    <p className="text-sm text-gray-500">{file.name}</p>
                    <button 
                      className="mt-6 px-4 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    >
                      Remove File
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <textarea 
                 className="w-full border border-gray-300 rounded-xl p-5 resize-none h-72 focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-gray-700 leading-relaxed shadow-sm placeholder:text-gray-400"
                 placeholder="Paste candidate IDs and resume links here..."
                 value={candidateText}
                 onChange={(e) => setCandidateText(e.target.value)}
              ></textarea>
            )
          )}
        </div>

        {/* Job Description Side */}
        <div className="flex-1 flex flex-col gap-3">
           <h2 className="text-xl font-bold text-gray-800 mb-1">Job Description</h2>
           {!isCollapsed && (
             <textarea 
               className="w-full border border-gray-300 rounded-xl p-5 resize-none h-72 focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-gray-700 leading-relaxed shadow-sm placeholder:text-gray-400"
               placeholder="Paste the complete job description here..."
               value={jobDescription}
               onChange={(e) => setJobDescription(e.target.value)}
             ></textarea>
           )}
        </div>

      </div>

      {!isCollapsed && (
        <div className="flex justify-end mt-2 pt-6 border-t border-gray-100">
          <button 
            className="bg-brand hover:bg-brand-hover text-white px-10 py-3 rounded-lg font-bold text-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            onClick={handleSubmit}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H5"/><path d="M19 16h-2"/><path d="M11 2h2"/></svg>
            Analyze Resumes
          </button>
        </div>
      )}
    </div>
  );
}
