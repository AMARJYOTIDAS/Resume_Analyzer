import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import FileUploadSection from './components/FileUploadSection';
import ScoreOverviewCard from './components/ScoreOverviewCard';
import SkillsAnalysisCard from './components/SkillsAnalysisCard';
import StrengthsWeaknessesCard from './components/StrengthsWeaknessesCard';
import SectionReviewCard from './components/SectionReviewCard';
import ContentImproverCard from './components/ContentImproverCard';
import HistoryDrawer from './components/HistoryDrawer';
import Toast from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer'); // 'analyzer' | 'history'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [dbConnected, setDbConnected] = useState(true);
  const [apiMode, setApiMode] = useState('Gemini AI');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Load history list on startup
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data.history || []);
        if (data.dbConnected !== undefined) setDbConnected(data.dbConnected);
      }
    } catch (err) {
      console.warn('Failed to load history list:', err);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  // Perform Analysis
  const handleAnalyze = async (payload) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();

      if (payload.inputMode === 'file' && payload.resumeFile) {
        formData.append('resume', payload.resumeFile);
      } else if (payload.inputMode === 'text' && payload.resumeText) {
        formData.append('resumeText', payload.resumeText);
      }

      if (payload.jdMode === 'file' && payload.jdFile) {
        formData.append('jd', payload.jdFile);
      } else if (payload.jdMode === 'text' && payload.jdText) {
        formData.append('jdText', payload.jdText);
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed.');
      }

      setCurrentAnalysis(data);
      if (data.dbConnected !== undefined) setDbConnected(data.dbConnected);
      if (data.apiMode) setApiMode(data.apiMode);

      fetchHistory();
      showToast('Resume analysis completed!', 'success');

      // Trigger celebration if high score
      if (data.atsScore >= 80) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Scroll smoothly down to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);

    } catch (err) {
      setError(err.message || 'An error occurred during analysis.');
      showToast(err.message || 'Analysis failed.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Sample Demo
  const handleRunSample = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withJd: true })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to run sample demo.');

      setCurrentAnalysis(data);
      if (data.dbConnected !== undefined) setDbConnected(data.dbConnected);
      if (data.apiMode) setApiMode(data.apiMode);

      fetchHistory();
      setActiveTab('analyzer');
      showToast('Sample Demo Analysis Loaded!', 'success');

      if (data.atsScore >= 80) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);

    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load single history record
  const handleSelectHistory = async (id) => {
    try {
      const res = await fetch(`/api/history/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentAnalysis(data);
        setActiveTab('analyzer');
        showToast(`Loaded analysis for "${data.fileName}"`, 'info');

        setTimeout(() => {
          const resultsEl = document.getElementById('results-section');
          if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200);
      }
    } catch (err) {
      showToast('Could not load record.', 'error');
    }
  };

  // Delete history item
  const handleDeleteHistory = async (id) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistoryList((prev) => prev.filter((item) => item._id !== id));
        if (currentAnalysis && currentAnalysis._id === id) {
          setCurrentAnalysis(null);
        }
        showToast('Record deleted.', 'info');
      }
    } catch (err) {
      showToast('Failed to delete history item.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunSample={handleRunSample}
        isAnalyzing={isAnalyzing}
        apiMode={apiMode}
        dbConnected={dbConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-10">
        
        {activeTab === 'analyzer' ? (
          <>
            {/* File Upload / Input Form */}
            <FileUploadSection
              onAnalyze={handleAnalyze}
              onRunSample={handleRunSample}
              isAnalyzing={isAnalyzing}
              error={error}
            />

            {/* Analysis Results View */}
            {currentAnalysis && (
              <div id="results-section" className="space-y-10 animate-in fade-in duration-500 pt-4">
                
                {/* 1. Score Overview & Gauges */}
                <ScoreOverviewCard
                  analysis={currentAnalysis}
                  onCopy={handleCopy}
                  copiedKey={copiedKey}
                />

                {/* 2. Skills & Keyword Gap Analysis */}
                <SkillsAnalysisCard
                  matchingSkills={currentAnalysis.matchingSkills}
                  missingSkills={currentAnalysis.missingSkills}
                  missingJdKeywords={currentAnalysis.missingJdKeywords}
                />

                {/* 3. Strengths, Weaknesses & Formatting Issues */}
                <StrengthsWeaknessesCard
                  strengths={currentAnalysis.strengths}
                  weaknesses={currentAnalysis.weaknesses}
                  formattingIssues={currentAnalysis.formattingIssues}
                />

                {/* 4. Section-Wise Evaluation */}
                <SectionReviewCard
                  sectionSuggestions={currentAnalysis.sectionSuggestions}
                />

                {/* 5. AI Content Enhancer & Exact Corrections */}
                <ContentImproverCard
                  improvedSummary={currentAnalysis.improvedSummary}
                  improvedExperiences={currentAnalysis.improvedExperiences}
                  improvedProjects={currentAnalysis.improvedProjects}
                  exactCorrections={currentAnalysis.exactCorrections}
                  onCopy={handleCopy}
                  copiedKey={copiedKey}
                />

              </div>
            )}
          </>
        ) : (
          /* History View */
          <HistoryDrawer
            historyList={historyList}
            onSelect={handleSelectHistory}
            onDelete={handleDeleteHistory}
            dbConnected={dbConnected}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>AI Resume Analyzer &copy; {new Date().getFullYear()} — Powered by React, Vite, Tailwind CSS, Node.js, Express, MongoDB & Gemini AI</p>
      </footer>

      {/* Floating Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
