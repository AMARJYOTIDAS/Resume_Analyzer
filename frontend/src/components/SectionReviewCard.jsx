import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function SectionReviewCard({ sectionSuggestions = [] }) {
  if (!sectionSuggestions || sectionSuggestions.length === 0) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'good':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            Good
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold">
            <AlertTriangle className="w-3 h-3" />
            Needs Improvement
          </span>
        );
      case 'critical':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-semibold">
            <AlertCircle className="w-3 h-3" />
            Action Required
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-5 h-5 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">Section-Wise ATS Review</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectionSuggestions.map((item, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-sm font-bold text-slate-100">{item.section}</h4>
                {getStatusBadge(item.status)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                {item.suggestion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
