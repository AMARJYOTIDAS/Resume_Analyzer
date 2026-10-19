const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, default: 'pdf' },
  resumeText: { type: String, required: true },
  jdText: { type: String, default: '' },
  hasJd: { type: Boolean, default: false },
  
  atsScore: { type: Number, required: true, min: 0, max: 100 },
  matchPercentage: { type: Number, required: true, min: 0, max: 100 },
  summary: { type: String, default: '' },
  
  matchingSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  missingJdKeywords: [{ type: String }],
  
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  formattingIssues: [{ type: String }],
  
  sectionSuggestions: [
    {
      section: { type: String },
      status: { type: String, enum: ['good', 'warning', 'critical'] },
      suggestion: { type: String }
    }
  ],
  
  improvedSummary: { type: String, default: '' },
  
  improvedExperiences: [
    {
      original: { type: String },
      improved: { type: String },
      reason: { type: String }
    }
  ],
  
  improvedProjects: [
    {
      original: { type: String },
      improved: { type: String },
      reason: { type: String }
    }
  ],
  
  exactCorrections: [
    {
      original: { type: String },
      improved: { type: String },
      reason: { type: String },
      category: { type: String, default: 'General' }
    }
  ],
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
