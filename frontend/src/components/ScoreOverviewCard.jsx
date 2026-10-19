import React from 'react';
import { Award, Target, CheckCircle2, XCircle, AlertTriangle, Copy, Check } from 'lucide-react';

export default function ScoreOverviewCard({ analysis, onCopy, copiedKey }) {
  if (!analysis) return null;

  const {
    atsScore = 0,
    matchPercentage = 0,
    hasJd = false,
    summary = '',
    matchingSkills = [],
    missingSkills = [],
    exactCorrections = [],
    sectionSuggestions = []
  } = analysis;

  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-emerald-400', stroke: '#10b981', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 60) return { text: 'text-amber-400', stroke: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { text: 'text-rose-400', stroke: '#f43f5e', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const atsColor = getScoreColor(atsScore);
  const matchColor = getScoreColor(matchPercentage);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl backdrop-blur-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* GAUGES COLUMN (4 cols) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
          
          {/* ATS Score Gauge */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={atsColor.stroke}
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * atsScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-black ${atsColor.text}`}>{atsScore}</span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Out of 100</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Overall ATS Readiness Score</span>
            </div>
          </div>

          {/* JD Match Gauge (if JD provided) */}
          {hasJd && (
            <div className="flex flex-col items-center text-center border-t sm:border-t-0 sm:border-l lg:border-l-0 lg:border-t border-slate-700/60 pt-4 sm:pt-0 lg:pt-4 sm:pl-6 lg:pl-0">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={matchColor.stroke}
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * matchPercentage) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black ${matchColor.text}`}>{matchPercentage}%</span>
                  <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Match Ratio</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Target className="w-4 h-4 text-purple-400" />
                <span>Job Description Match</span>
              </div>
            </div>
          )}
        </div>

        {/* SUMMARY & STATS COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Executive Summary Box */}
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">Executive Summary</h3>
              {summary && (
                <button
                  onClick={() => onCopy(summary, 'exec_summary')}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  {copiedKey === 'exec_summary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'exec_summary' ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {summary || 'Resume analysis completed successfully.'}
            </p>
          </div>

          {/* Stat Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center text-emerald-400 mb-1">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-white">{matchingSkills.length}</p>
              <p className="text-[11px] text-slate-400 font-medium">Matching Skills</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center text-rose-400 mb-1">
                <XCircle className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-white">{missingSkills.length}</p>
              <p className="text-[11px] text-slate-400 font-medium">Missing Skills</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center text-amber-400 mb-1">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-white">{sectionSuggestions.length}</p>
              <p className="text-[11px] text-slate-400 font-medium">Section Reviews</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center text-purple-400 mb-1">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-white">{exactCorrections.length}</p>
              <p className="text-[11px] text-slate-400 font-medium">Line Rewrites</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
