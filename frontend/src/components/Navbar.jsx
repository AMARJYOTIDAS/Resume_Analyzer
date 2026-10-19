import React from 'react';
import { FileText, Cpu, Database, History, PlayCircle, RefreshCw } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onRunSample, isAnalyzing, apiMode, dbConnected }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('analyzer')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AI Resume Analyzer
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                v2.0 PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">ATS Scoring & JD Optimization Engine</p>
          </div>
        </div>

        {/* Center & Right Badges & Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Status Indicators */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Engine: <strong className="text-cyan-300 font-semibold">{apiMode || 'Gemini AI'}</strong></span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Database className={`w-3.5 h-3.5 ${dbConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>Storage: <strong className={dbConnected ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-semibold'}>
                {dbConnected ? 'MongoDB' : 'Local Persistence'}
              </strong></span>
            </div>
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>

          {/* Quick Demo Button */}
          <button
            onClick={onRunSample}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            title="Run instant analysis with pre-loaded realistic sample data"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <PlayCircle className="w-3.5 h-3.5" />
            )}
            <span>Demo Test</span>
          </button>
        </div>
      </div>
    </header>
  );
}
