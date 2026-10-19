const fs = require('fs');
const path = require('path');
const Analysis = require('../models/Analysis');
const { isDbConnected } = require('../config/db');

// Local fallback storage path
const memoryStorePath = path.join(__dirname, '../data/history_fallback.json');

function ensureLocalDirExists() {
  const dir = path.dirname(memoryStorePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readLocalHistory() {
  ensureLocalDirExists();
  if (fs.existsSync(memoryStorePath)) {
    try {
      const data = fs.readFileSync(memoryStorePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }
  return [];
}

function saveLocalHistory(list) {
  ensureLocalDirExists();
  fs.writeFileSync(memoryStorePath, JSON.stringify(list, null, 2), 'utf8');
}

/**
 * Saves a new analysis entry to MongoDB or local storage fallback.
 */
async function saveAnalysisEntry(analysisData) {
  if (isDbConnected()) {
    try {
      const doc = new Analysis(analysisData);
      const savedDoc = await doc.save();
      return savedDoc.toObject();
    } catch (err) {
      console.warn('[HistoryService] MongoDB save error, storing locally:', err.message);
    }
  }

  // Fallback to local storage
  const list = readLocalHistory();
  const entry = {
    _id: Date.now().toString(),
    ...analysisData,
    createdAt: new Date().toISOString()
  };
  list.unshift(entry);
  if (list.length > 50) list.pop(); // Keep last 50
  saveLocalHistory(list);
  return entry;
}

/**
 * Gets history list.
 */
async function getHistoryList() {
  if (isDbConnected()) {
    try {
      const docs = await Analysis.find()
        .select('_id fileName fileType hasJd atsScore matchPercentage createdAt matchingSkills')
        .sort({ createdAt: -1 })
        .limit(30);
      return docs;
    } catch (err) {
      console.warn('[HistoryService] MongoDB fetch error, falling back to local storage:', err.message);
    }
  }

  const list = readLocalHistory();
  return list.map(item => ({
    _id: item._id,
    fileName: item.fileName,
    fileType: item.fileType,
    hasJd: item.hasJd,
    atsScore: item.atsScore,
    matchPercentage: item.matchPercentage,
    createdAt: item.createdAt,
    matchingSkills: item.matchingSkills || []
  }));
}

/**
 * Gets single history record by ID.
 */
async function getHistoryById(id) {
  if (isDbConnected()) {
    try {
      const doc = await Analysis.findById(id);
      if (doc) return doc;
    } catch (err) {
      console.warn('[HistoryService] MongoDB findById error:', err.message);
    }
  }

  const list = readLocalHistory();
  return list.find(item => item._id === id) || null;
}

/**
 * Deletes single history record by ID.
 */
async function deleteHistoryById(id) {
  if (isDbConnected()) {
    try {
      await Analysis.findByIdAndDelete(id);
      return true;
    } catch (err) {
      console.warn('[HistoryService] MongoDB delete error:', err.message);
    }
  }

  let list = readLocalHistory();
  const initialLen = list.length;
  list = list.filter(item => item._id !== id);
  saveLocalHistory(list);
  return list.length < initialLen;
}

module.exports = {
  saveAnalysisEntry,
  getHistoryList,
  getHistoryById,
  deleteHistoryById
};
