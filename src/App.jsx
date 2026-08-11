import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsTable from './components/ResultsTable';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [expectedCount, setExpectedCount] = useState(0);

  const handleAnalyze = async (jobDescription, file, candidateText) => {
    setLoading(true);
    setStatusMsg('Submitting analysis...');
    setResults([]);
    setExpectedCount(0);
    
    try {
      const formData = new FormData();
      // Append a unique timestamp to force a fresh hash and bypass backend caching
      const uniqueJobDescription = `${jobDescription}\n\n[Analysis Session: ${Date.now()}]`;
      formData.append('job_description', uniqueJobDescription);
      if (file) {
        formData.append('csv_file', file);
      }
      if (candidateText) {
        formData.append('candidate_text_block', candidateText);
      }

      const submitRes = await fetch('/api/v1/submit/analyze-resumes', {
        method: 'POST',
        body: formData,
      });

      if (!submitRes.ok) {
        throw new Error(`Failed to submit analysis: ${submitRes.statusText}`);
      }

      const submitData = await submitRes.json();
      const hash = submitData.job_description_hash;
      const queued = submitData.candidates_queued || 0;
      setExpectedCount(queued);
      
      if (!hash) {
        throw new Error('No job description hash received');
      }

      setStatusMsg(`Analysis queued. Processing ${queued} candidates...`);
      
      const poll = async () => {
        try {
          const pollRes = await fetch(`/api/v1/submit/results/${hash}`);
          if (!pollRes.ok) {
            throw new Error(`Failed to fetch results: ${pollRes.statusText}`);
          }
          const pollData = await pollRes.json();
          const currentData = pollData.data || [];
          
          // Show data immediately as it streams in
          setResults(currentData);
          
          // Stop if status is completed, OR if we've fetched all expected candidates
          if (pollData.status === 'completed' || (queued > 0 && currentData.length >= queued)) {
            setLoading(false);
            setStatusMsg('');
          } else {
            setStatusMsg(`Analyzing... ${currentData.length} of ${queued} candidates processed.`);
            setTimeout(poll, 3000);
          }
        } catch (err) {
          console.error(err);
          setStatusMsg('Error fetching results. Retrying...');
          setTimeout(poll, 5000);
        }
      };

      setTimeout(poll, 2000);

    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
      setLoading(false);
      setStatusMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-8">
        <InputSection onAnalyze={handleAnalyze} />
        
        {loading && results.length === 0 && (
          <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-b-brand mb-6"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing Resumes</h3>
            <p className="text-gray-500 font-medium">{statusMsg}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="max-w-7xl mx-auto">
            {loading && (
               <div className="flex items-center justify-center gap-3 mb-6 bg-indigo-50 text-brand p-3 rounded-lg border border-indigo-100 shadow-sm animate-pulse">
                 <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand border-t-transparent"></div>
                 <span className="font-semibold text-sm">{statusMsg}</span>
               </div>
            )}
            <ResultsTable data={results} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
