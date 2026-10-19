import React, { useState } from 'react';
import { CheckCircle, AlertOctagon, Tag, Search, Filter } from 'lucide-react';

export default function SkillsAnalysisCard({ matchingSkills = [], missingSkills = [], missingJdKeywords = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filterItems = (arr) => {
    if (!searchTerm.trim()) return arr;
    return arr.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const filteredMatching = filterItems(matchingSkills);
  const filteredMissing = filterItems(missingSkills);
  const filteredKeywords = filterItems(missingJdKeywords);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-cyan-400" />
            <span>Skills & Keyword Gap Analysis</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Compare candidate skills against industry standards & Job Description keywords.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search skills..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MATCHING SKILLS */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Matching Skills ({matchingSkills.length})</span>
            </h4>
          </div>
          {filteredMatching.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filteredMatching.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No matching skills found.</p>
          )}
        </div>

        {/* MISSING SKILLS */}
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              <span>Missing Tech Skills ({missingSkills.length})</span>
            </h4>
          </div>
          {filteredMissing.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filteredMissing.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold"
                >
                  + {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No missing skills detected!</p>
          )}
        </div>

        {/* MISSING JD KEYWORDS */}
        <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Missing JD Keywords ({missingJdKeywords.length})</span>
            </h4>
          </div>
          {filteredKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filteredKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold"
                >
                  # {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No additional missing keywords.</p>
          )}
        </div>

      </div>
    </div>
  );
}
