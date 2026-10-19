import React, { useState } from 'react';
import { Wand2, Copy, Check, ArrowRight, Sparkles, Filter } from 'lucide-react';

export default function ContentImproverCard({
  improvedSummary = '',
  improvedExperiences = [],
  improvedProjects = [],
  exactCorrections = [],
  onCopy,
  copiedKey
}) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(exactCorrections.map(c => c.category || 'General')))];

  const filteredCorrections = activeCategory === 'All'
    ? exactCorrections
    : exactCorrections.filter(c => (c.category || 'General') === activeCategory);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl backdrop-blur-xl space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Content Enhancer & Rewriter</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            ATS-Optimized Professional Content
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Copy enhanced summaries, bullet points, and exact phrase rewrites directly into your resume.
          </p>
        </div>
      </div>

      {/* 1. IMPROVED SUMMARY */}
      {improvedSummary && (
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Improved Professional Summary</span>
            </h4>
            <button
              onClick={() => onCopy(improvedSummary, 'summary_enhanced')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              {copiedKey === 'summary_enhanced' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'summary_enhanced' ? 'Copied Summary!' : 'Copy Improved Summary'}</span>
            </button>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-700/80 italic">
            "{improvedSummary}"
          </p>
        </div>
      )}

      {/* 2. IMPROVED EXPERIENCES & PROJECTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Experience Bullets */}
        <div className="space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Improved Experience Bullets</span>
          </h4>
          {improvedExperiences.length > 0 ? (
            improvedExperiences.map((exp, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <div className="text-xs text-rose-300/90 bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/20">
                  <strong className="block text-[10px] uppercase text-rose-400 font-bold mb-0.5">Original Phrase:</strong>
                  <span>"{exp.original}"</span>
                </div>
                <div className="flex items-center justify-center text-slate-500 my-1">
                  <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                </div>
                <div className="text-xs text-emerald-300 bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/30 relative">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="block text-[10px] uppercase text-emerald-400 font-bold">AI Improved Action Bullet:</strong>
                    <button
                      onClick={() => onCopy(exp.improved, `exp_${idx}`)}
                      className="text-emerald-400 hover:text-white transition-colors"
                      title="Copy improved bullet"
                    >
                      {copiedKey === `exp_${idx}` ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span>"{exp.improved}"</span>
                </div>
                {exp.reason && (
                  <p className="text-[11px] text-slate-400 italic">
                    💡 <strong>Reason:</strong> {exp.reason}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No experience rewrites suggested.</p>
          )}
        </div>

        {/* Project Bullets */}
        <div className="space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Improved Project Descriptions</span>
          </h4>
          {improvedProjects.length > 0 ? (
            improvedProjects.map((proj, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <div className="text-xs text-rose-300/90 bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/20">
                  <strong className="block text-[10px] uppercase text-rose-400 font-bold mb-0.5">Original Project Description:</strong>
                  <span>"{proj.original}"</span>
                </div>
                <div className="flex items-center justify-center text-slate-500 my-1">
                  <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                </div>
                <div className="text-xs text-purple-300 bg-purple-950/30 p-3 rounded-lg border border-purple-500/30 relative">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="block text-[10px] uppercase text-purple-400 font-bold">AI Enhanced Project Bullet:</strong>
                    <button
                      onClick={() => onCopy(proj.improved, `proj_${idx}`)}
                      className="text-purple-400 hover:text-white transition-colors"
                      title="Copy improved bullet"
                    >
                      {copiedKey === `proj_${idx}` ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span>"{proj.improved}"</span>
                </div>
                {proj.reason && (
                  <p className="text-[11px] text-slate-400 italic">
                    💡 <strong>Reason:</strong> {proj.reason}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No project rewrites needed.</p>
          )}
        </div>

      </div>

      {/* 3. EXACT LINE-BY-LINE CORRECTIONS TABLE ("Original → Improved → Reason") */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Exact Line Corrections ("Original → Improved → Reason")</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Specific line-by-line grammar, action verb, and keyword upgrades.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredCorrections.length > 0 ? (
          <div className="space-y-3">
            {filteredCorrections.map((corr, idx) => (
              <div
                key={idx}
                className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 transition-all hover:border-slate-600"
              >
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  
                  {/* Original */}
                  <div className="flex-1 bg-rose-950/20 border border-rose-500/20 rounded-xl p-3">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Original Phrasing:</span>
                    <p className="text-xs text-rose-200">{corr.original}</p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex items-center justify-center text-slate-500 shrink-0">
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                  </div>

                  {/* Improved */}
                  <div className="flex-1 bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">Improved ATS Phrasing:</span>
                      <button
                        onClick={() => onCopy(corr.improved, `corr_${idx}`)}
                        className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-white transition-colors"
                      >
                        {copiedKey === `corr_${idx}` ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === `corr_${idx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-emerald-200 font-medium">{corr.improved}</p>
                  </div>

                </div>

                {/* Reason & Category */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">Reason:</strong> {corr.reason}
                  </p>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-700/60 text-slate-300 text-[10px] font-medium shrink-0">
                    Category: {corr.category || 'General'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No line-by-line corrections matching filter.</p>
        )}
      </div>

    </div>
  );
}
