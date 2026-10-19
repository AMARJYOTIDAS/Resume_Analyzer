import React from 'react';
import { ThumbsUp, AlertTriangle, Layout } from 'lucide-react';

export default function StrengthsWeaknessesCard({ strengths = [], weaknesses = [], formattingIssues = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* STRENGTHS */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-base">Key Strengths</h3>
        </div>
        <ul className="space-y-3 flex-1">
          {strengths.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
          {strengths.length === 0 && (
            <p className="text-xs text-slate-500 italic">No strengths highlighted.</p>
          )}
        </ul>
      </div>

      {/* WEAKNESSES */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-base">Areas for Improvement</h3>
        </div>
        <ul className="space-y-3 flex-1">
          {weaknesses.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
          {weaknesses.length === 0 && (
            <p className="text-xs text-slate-500 italic">No major weaknesses identified.</p>
          )}
        </ul>
      </div>

      {/* FORMATTING & CONTENT ISSUES */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Layout className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-base">Formatting & ATS Issues</h3>
        </div>
        <ul className="space-y-3 flex-1">
          {formattingIssues.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
          {formattingIssues.length === 0 && (
            <p className="text-xs text-slate-500 italic">Formatting is ATS friendly.</p>
          )}
        </ul>
      </div>

    </div>
  );
}
