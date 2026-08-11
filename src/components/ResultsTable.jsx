import React, { useState } from 'react';

export default function ResultsTable({ data }) {
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  if (!data || data.length === 0) {
    return null;
  }

  const openModal = (title, content) => {
    if (!content || content === '-') return;
    setModalTitle(title);
    setModalContent(content);
  };

  // Helper to safely render arrays or truncate long strings
  const renderArray = (arr) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return '-';
    return arr.join(', ');
  };

  const renderTruncated = (text, maxLength = 60, truncate = true) => {
    if (!text) return '-';
    const str = String(text);
    if (!truncate) return str;
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  const renderProjectRemark = (remark, truncate = true) => {
    if (!remark) return '-';
    let res = [];
    if (remark.strengths) res.push(`Strengths: ${remark.strengths}`);
    if (remark.gaps) res.push(`Gaps: ${remark.gaps}`);
    const separator = truncate ? ' | ' : '\n\n';
    return renderTruncated(res.join(separator), 60, truncate);
  };

  const renderObject = (obj, truncate = true) => {
    if (!obj || Object.keys(obj).length === 0) return '-';
    try {
      if (!truncate) return <pre className="font-mono text-sm">{JSON.stringify(obj, null, 2)}</pre>;
      return renderTruncated(JSON.stringify(obj).replace(/[{""}]/g, ' '), 60, true);
    } catch {
      return '-';
    }
  };

  // Custom renderer for the Github Repo table in the modal
  const renderGithubRepoTable = (repoObj) => {
    if (!repoObj || Object.keys(repoObj).length === 0) return '-';
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-bold text-gray-700">Repository Name</th>
              <th className="p-4 font-bold text-gray-700">Tech Stack</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {Object.entries(repoObj).map(([repoName, techStack], i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-brand">{repoName}</td>
                <td className="p-4 text-gray-600">
                  {Array.isArray(techStack) ? techStack.join(', ') : String(techStack)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGithubRepoSummary = (repoObj) => {
    if (!repoObj || Object.keys(repoObj).length === 0) return '-';
    const summary = Object.entries(repoObj)
      .map(([repo, stack]) => `${repo} (${Array.isArray(stack) ? stack.join(', ') : stack})`)
      .join(' | ');
    return renderTruncated(summary, 60, true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full mb-12 flex flex-col">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-xl">
        <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 font-medium hidden md:inline-block animate-pulse">
            Scroll horizontally ➔
          </span>
          <button className="flex items-center gap-2 border border-gray-300 px-5 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>
      
      {/* Scrollable container with styled scrollbar */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th className="p-5 sticky left-0 bg-gray-50 z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Candidate ID</th>
              <th className="p-5">Resume Link</th>
              <th className="p-5">Match Score</th>
              <th className="p-5">Priority</th>
              <th className="p-5">Experience</th>
              <th className="p-5 max-w-xs">Experience Remarks</th>
              <th className="p-5">Project Score</th>
              <th className="p-5 max-w-xs">Project Remark</th>
              <th className="p-5 max-w-xs">Skills</th>
              <th className="p-5 max-w-xs">Matching Github Repo</th>
              <th className="p-5">Github Score</th>
              <th className="p-5 max-w-xs">Coding Profile Summary</th>
              <th className="p-5 max-w-xs">Education Summary</th>
              <th className="p-5 max-w-xs">Other Remarks</th>
              <th className="p-5">Recommended</th>
              <th className="p-5 max-w-xs">Overall Summary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 bg-white">
            {data.map((candidate, idx) => (
              <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                <td className="p-5 font-bold text-brand sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  {candidate.user_id}
                </td>
                <td className="p-5">
                  <a href={candidate.resume_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 font-medium">
                    View
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                  </a>
                </td>
                <td className="p-5">
                  <span className={`font-bold text-lg ${
                    candidate.resume_score >= 80 ? 'text-green-600' :
                    candidate.resume_score >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {candidate.resume_score}%
                  </span>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    candidate.priority === 'High' ? 'bg-green-100 text-green-700' :
                    candidate.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {candidate.priority}
                  </span>
                </td>
                <td className="p-5 font-medium">{candidate.experience} yrs</td>
                
                <td 
                  className="p-5 text-xs text-gray-500 whitespace-normal min-w-[200px] cursor-pointer hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onDoubleClick={() => openModal('Experience Remarks', renderArray(candidate.experience_remarks))}
                  title="Double click to view full text"
                >
                  {renderTruncated(renderArray(candidate.experience_remarks))}
                </td>
                
                <td className="p-5 font-semibold text-center">{candidate.project_score}</td>
                
                <td 
                  className="p-5 text-xs text-gray-500 whitespace-normal min-w-[250px] cursor-pointer hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onDoubleClick={() => openModal('Project Remark', renderProjectRemark(candidate.project_remark, false))}
                  title="Double click to view full text"
                >
                  {renderProjectRemark(candidate.project_remark)}
                </td>
                
                <td 
                  className="p-5 text-xs text-gray-500 whitespace-normal min-w-[200px] cursor-pointer hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onDoubleClick={() => openModal('Skills', renderArray(candidate.skills))}
                  title="Double click to view full text"
                >
                  {renderTruncated(renderArray(candidate.skills), 80)}
                </td>
                
                <td 
                  className="p-5 text-xs text-gray-500 whitespace-normal min-w-[200px] cursor-pointer hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onDoubleClick={() => openModal('Matching Github Repositories', renderGithubRepoTable(candidate.matching_github_repo))}
                  title="Double click to view full table"
                >
                  {renderGithubRepoSummary(candidate.matching_github_repo)}
                </td>
                
                <td className="p-5 font-semibold text-center">{candidate.github_score}</td>
                
                <td 
                  className="p-5 text-xs text-gray-500 whitespace-normal min-w-[200px] cursor-pointer hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onDoubleClick={() => openModal('Coding Profile Summary', renderObject(candidate.coding_profile_summary, false))}
                  title="Double click to view full text"
                >
                  {renderObject(candidate.coding_profile_summary)}
                </td>
                
                <td 
                  className="p-5 text-xs text-gray-500 whitespace-normal min-w-[150px] cursor-pointer hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onDoubleClick={() => openModal('Education Summary', candidate.education_summary)}
                  title="Double click to view full text"
                >
                  {renderTruncated(candidate.education_summary)}
                </td>
                
                <td 
                  className="p-5 text-xs text-gray-500 whitespace-normal min-w-[150px] cursor-pointer hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onDoubleClick={() => openModal('Other Remarks', candidate.other_remarks)}
                  title="Double click to view full text"
                >
                  {renderTruncated(candidate.other_remarks)}
                </td>
                
                <td className="p-5">
                  {candidate.recommended === 'Yes' ? (
                    <span className="flex items-center gap-1 text-green-600 font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Yes
                    </span>
                  ) : (
                    <span className="text-gray-400 font-medium">{candidate.recommended || '-'}</span>
                  )}
                </td>
                
                <td 
                  className="p-5 text-xs text-gray-500 whitespace-normal min-w-[250px] cursor-pointer hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onDoubleClick={() => openModal('Overall Summary', renderArray(candidate.overall_summary))}
                  title="Double click to view full text"
                >
                  {renderTruncated(renderArray(candidate.overall_summary), 100)}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-5 border-t border-gray-200 bg-gray-50 text-sm text-gray-500 font-medium rounded-b-xl flex justify-between items-center">
        <span>Showing {data.length} Candidates</span>
        <span className="text-xs text-gray-400">Double-click on text cells to view full details</span>
      </div>

      {/* Modal Dialog */}
      {modalContent && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setModalContent(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">{modalTitle}</h3>
              <button 
                onClick={() => setModalContent(null)} 
                className="text-gray-400 hover:text-red-500 transition-colors bg-white hover:bg-red-50 rounded-lg p-1.5 border border-gray-200 hover:border-red-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto whitespace-pre-wrap text-gray-700 leading-relaxed font-medium bg-white">
              {modalContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
