import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Briefcase,
  FileCode,
  PlayCircle,
} from "lucide-react";

export default function FileUploadSection({
  onAnalyze,
  onRunSample,
  isAnalyzing,
  error,
}) {
  const [inputMode, setInputMode] = useState("file"); // 'file' | 'text'
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");

  const [jdMode, setJdMode] = useState("none"); // 'none' | 'text' | 'file'
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState(null);

  const resumeInputRef = useRef(null);
  const jdInputRef = useRef(null);

  const handleResumeDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetResume(file);
    }
  };

  const validateAndSetResume = (file) => {
    const validExts = [".pdf", ".docx", ".doc", ".txt"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!validExts.includes(ext)) {
      alert("Please upload a PDF, Word (.docx), or TXT document.");
      return;
    }
    setResumeFile(file);
  };

  const handleJdDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setJdFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMode === "file" && !resumeFile) {
      alert("Please upload a Resume document before running analysis.");
      return;
    }
    if (inputMode === "text" && !resumeText.trim()) {
      alert("Please paste your Resume text before running analysis.");
      return;
    }

    onAnalyze({
      inputMode,
      resumeFile,
      resumeText,
      jdMode,
      jdText,
      jdFile,
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Next-Gen Gemini 2.5 & ATS Optimization</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Supercharge Your Resume for Target Jobs
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Upload your resume and optionally add a Job Description to get instant
          ATS scores, keyword gap analysis, section reviews, and line-by-line AI
          rewrites.
        </p>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Analysis Error</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: RESUME INPUT */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-base">
                    1. Candidate Resume
                  </h3>
                </div>
                {/* Input Toggle */}
                <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/80 text-xs">
                  <button
                    type="button"
                    onClick={() => setInputMode("file")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      inputMode === "file"
                        ? "bg-blue-600 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("text")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      inputMode === "text"
                        ? "bg-blue-600 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Paste Text
                  </button>
                </div>
              </div>

              {inputMode === "file" ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleResumeDrop}
                  onClick={() => resumeInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    resumeFile
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-slate-700 hover:border-blue-500/60 bg-slate-900/40 hover:bg-slate-900/80"
                  }`}
                >
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      validateAndSetResume(e.target.files[0])
                    }
                    className="hidden"
                  />

                  {resumeFile ? (
                    <div className="flex items-center justify-between bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-left">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-white truncate">
                            {resumeFile.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {(resumeFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                        }}
                        className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-200">
                        Drag & Drop your Resume here or{" "}
                        <span className="text-blue-400 underline">Browse</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports PDF, DOCX, TXT (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <textarea
                    rows={8}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste the full text of your resume here..."
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  />
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-3">
              🔒 Documents are parsed in-memory and analyzed securely.
            </p>
          </div>

          {/* RIGHT COLUMN: JOB DESCRIPTION INPUT */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-base">
                    2. Job Description (Optional)
                  </h3>
                </div>
                {/* JD Mode Selection */}
                <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/80 text-xs">
                  <button
                    type="button"
                    onClick={() => setJdMode("none")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      jdMode === "none"
                        ? "bg-purple-600 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    No JD
                  </button>
                  <button
                    type="button"
                    onClick={() => setJdMode("text")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      jdMode === "text"
                        ? "bg-purple-600 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Paste JD
                  </button>
                  <button
                    type="button"
                    onClick={() => setJdMode("file")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      jdMode === "file"
                        ? "bg-purple-600 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {jdMode === "none" && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-center h-[200px] flex flex-col items-center justify-center">
                  <Briefcase className="w-10 h-10 text-slate-600 mb-2" />
                  <p className="text-sm font-medium text-slate-300">
                    General ATS Resume Analysis
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    No Job Description attached. The AI will evaluate overall
                    ATS score, structure, action verbs, and core industry
                    readiness.
                  </p>
                </div>
              )}

              {jdMode === "text" && (
                <div>
                  <textarea
                    rows={8}
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste target Job Description (responsibilities, required skills, tools)..."
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  />
                </div>
              )}

              {jdMode === "file" && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleJdDrop}
                  onClick={() => jdInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    jdFile
                      ? "border-purple-500/50 bg-purple-500/5"
                      : "border-slate-700 hover:border-purple-500/60 bg-slate-900/40 hover:bg-slate-900/80"
                  }`}
                >
                  <input
                    ref={jdInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) =>
                      e.target.files?.[0] && setJdFile(e.target.files[0])
                    }
                    className="hidden"
                  />

                  {jdFile ? (
                    <div className="flex items-center justify-between bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-left">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                          <FileCode className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-white truncate">
                            {jdFile.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {(jdFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setJdFile(null);
                        }}
                        className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-200">
                        Upload JD file or{" "}
                        <span className="text-purple-400 underline">
                          Browse
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PDF, DOCX, TXT
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-3">
              🎯 Adding a JD enables direct skill gap mapping & matching ratio.
            </p>
          </div>
        </div>

        {/* SUBMIT & DEMO BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-blue-600/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running AI Deep Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Resume with AI</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRunSample}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <PlayCircle className="w-4 h-4 text-emerald-400" />
            <span>Try Sample Demo Data</span>
          </button>
        </div>
      </form>
    </div>
  );
}
