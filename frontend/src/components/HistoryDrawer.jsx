import React from 'react';
import { History, FileText, Trash2, Calendar, Award, Target, ArrowRight, Database } from 'lucide-react';

export default function HistoryDrawer({ historyList = [], onSelect, onDelete, dbConnected }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Analysis History</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Saved Resume Analyses</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Review previous ATS reports and comparisons.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
          <Database className={`w-3.5 h-3.5 ${dbConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="text-slate-300">
            Storage Mode: <strong className={dbConnected ? 'text-emerald-400' : 'text-amber-400'}>{dbConnected ? 'MongoDB' : 'Local Persistence'}</strong>
          </span>
        </div>
      </div>

      {historyList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {historyList.map((item) => {
            const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Recent';

            return (
              <div
                key={item._id}
                className="bg-slate-800/40 border border-slate-700/60 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-blue-500/5 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-white truncate" title={item.fileName}>
                        {item.fileName}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete analysis for "${item.fileName}"?`)) {
                          onDelete(item._id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs mb-4">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      <span>ATS: {item.atsScore}/100</span>
                    </div>

                    {item.hasJd && (
                      <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
                        <Target className="w-3.5 h-3.5" />
                        <span>JD Match: {item.matchPercentage}%</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-4">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{dateStr}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelect(item._id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-700/60 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all group-hover:bg-blue-600"
                >
                  <span>View Full Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800/20 rounded-2xl border border-slate-800">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No Analysis History Yet</h4>
          <p className="text-xs text-slate-500 mt-1">
            Run your first resume analysis or try the sample demo to populate your history.
          </p>
        </div>
      )}
    </div>
  );
}
