const express = require('express');
const multer = require('multer');
const { parseFileBuffer } = require('../services/parserService');
const { analyzeResume } = require('../services/geminiService');
const {
  saveAnalysisEntry,
  getHistoryList,
  getHistoryById,
  deleteHistoryById
} = require('../services/historyService');
const { isDbConnected } = require('../config/db');

const router = express.Router();

// Multer memory storage configuration (10MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Sample Resume for instant 1-click test
const SAMPLE_RESUME = `
ALEX CHEN
San Francisco, CA | (555) 019-2831 | alex.chen@email.com | github.com/alexchen | linkedin.com/in/alexchen

PROFESSIONAL SUMMARY
Full Stack Software Engineer with 4+ years of experience building modern web applications. Worked on backend microservices with Node.js and Express, and built frontend UIs in React. Responsible for database maintenance, fixing bugs, and deploying features.

TECHNICAL SKILLS
- Languages: JavaScript, TypeScript, HTML5, CSS3, Python, SQL
- Frontend: React.js, Redux, Tailwind CSS, Vite
- Backend: Node.js, Express.js, REST APIs
- Databases: MongoDB, PostgreSQL
- Tools & Utilities: Git, GitHub, Postman, Jest, VS Code

WORK EXPERIENCE
Software Engineer | CloudScale Tech | Jan 2022 – Present
- Worked on backend APIs using Node.js and Express for customer portal.
- Responsible for managing database schemas and writing queries in MongoDB.
- Created React components for user dashboard and improved site look and feel.
- Handled bug fixes, software updates, and daily customer support tickets.

Junior Web Developer | WebCraft Solutions | Jun 2020 – Dec 2021
- Created landing pages and responsive websites using HTML, CSS, JavaScript, and React.
- Responsible for integrating REST API endpoints with frontend state.
- Worked with team members to test application functionality and push code updates.

PROJECTS
Smart Invoice Generator | React, Node.js, MongoDB, Express
- Made a full stack web app with React and MongoDB that lets small businesses generate PDF invoices.
- Implemented user authentication and saved invoice data to database.

Developer Portfolio Website | React, Tailwind CSS
- Designed responsive personal portfolio site showcasing projects and technical skills.

EDUCATION
Bachelor of Science in Computer Science | State University, 2020
`;

const SAMPLE_JD = `
Senior Full Stack Engineer (React & Node.js)
Company: TechHorizon Systems
Location: Remote / San Francisco, CA

Job Description:
We are seeking a talented Senior Full Stack Engineer to join our core engineering team. You will lead the development of scalable web applications, architect cloud infrastructure, and mentor junior developers.

Key Responsibilities:
- Architect, build, and optimize scalable microservices using Node.js, Express, and TypeScript.
- Design responsive, high-performance UI components using React and Tailwind CSS.
- Optimize database performance and schema design across PostgreSQL and MongoDB.
- Implement automated testing (Jest, Cypress) and robust CI/CD deployment pipelines on AWS/Docker.
- Collaborate with product managers and UX designers to deliver seamless digital experiences.

Required Qualifications & Skills:
- 3+ years of experience in Full Stack Software Development.
- Strong proficiency in JavaScript/TypeScript, React.js, and Node.js.
- Solid experience with RESTful APIs, GraphQL, and microservice architecture.
- Hands-on experience with Docker, Kubernetes, CI/CD pipelines, and AWS cloud services.
- Experience with Jest unit testing and database indexing/performance tuning.
- Excellent communication skills and track record of driving technical initiatives.
`;

/**
 * POST /api/analyze
 * Analyzes an uploaded Resume (PDF/DOCX/TXT) against optional JD text/file.
 */
router.post(
  '/analyze',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'jd', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      let resumeText = '';
      let fileName = 'Uploaded Resume';
      let fileType = 'pdf';

      // 1. Process Resume File or fallback text
      if (req.files && req.files['resume'] && req.files['resume'][0]) {
        const file = req.files['resume'][0];
        fileName = file.originalname;
        fileType = file.originalname.split('.').pop() || 'pdf';
        resumeText = await parseFileBuffer(file.buffer, file.originalname, file.mimetype);
      } else if (req.body.resumeText && req.body.resumeText.trim()) {
        resumeText = req.body.resumeText.trim();
        fileName = req.body.fileName || 'Pasted Resume Text';
        fileType = 'txt';
      } else {
        return res.status(400).json({ error: 'Please upload a valid Resume file (PDF, DOCX) or provide text.' });
      }

      if (!resumeText || resumeText.length < 30) {
        return res.status(400).json({ error: 'Could not extract sufficient text from the resume file. Please ensure the document is not an image-only scan or empty.' });
      }

      // 2. Process Job Description (JD) text or file
      let jdText = '';
      if (req.files && req.files['jd'] && req.files['jd'][0]) {
        const jdFile = req.files['jd'][0];
        jdText = await parseFileBuffer(jdFile.buffer, jdFile.originalname, jdFile.mimetype);
      } else if (req.body.jdText) {
        jdText = req.body.jdText.trim();
      }

      const hasJd = Boolean(jdText && jdText.length > 10);

      // 3. Perform AI Analysis
      console.log(`[AnalyzeRoute] Processing "${fileName}" (Has JD: ${hasJd})...`);
      const analysisResult = await analyzeResume(resumeText, jdText);

      // 4. Save to History (MongoDB or Fallback)
      const newRecord = await saveAnalysisEntry({
        fileName,
        fileType,
        resumeText,
        jdText,
        hasJd,
        ...analysisResult
      });

      return res.json({
        id: newRecord._id,
        fileName,
        hasJd,
        dbConnected: isDbConnected(),
        apiMode: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') ? 'Gemini AI' : 'Smart Demo Mode',
        ...analysisResult
      });

    } catch (err) {
      console.error('[AnalyzeRoute] Error:', err);
      return res.status(500).json({ error: err.message || 'An error occurred during resume analysis.' });
    }
  }
);

/**
 * POST /api/sample
 * Triggers instant sample demo analysis.
 */
router.post('/sample', async (req, res) => {
  try {
    const withJd = req.body.withJd !== false;
    const resumeText = SAMPLE_RESUME;
    const jdText = withJd ? SAMPLE_JD : '';
    const fileName = 'Sample_Developer_Resume.pdf';
    const fileType = 'pdf';

    console.log(`[AnalyzeRoute] Generating Sample Demo (With JD: ${withJd})...`);
    const analysisResult = await analyzeResume(resumeText, jdText);

    const newRecord = await saveAnalysisEntry({
      fileName,
      fileType,
      resumeText,
      jdText,
      hasJd: withJd,
      ...analysisResult
    });

    return res.json({
      id: newRecord._id,
      fileName,
      hasJd: withJd,
      isSample: true,
      dbConnected: isDbConnected(),
      apiMode: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') ? 'Gemini AI' : 'Smart Demo Mode',
      ...analysisResult
    });
  } catch (err) {
    console.error('[AnalyzeRoute] Sample error:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate sample analysis.' });
  }
});

/**
 * GET /api/history
 * Returns list of analysis history items.
 */
router.get('/history', async (req, res) => {
  try {
    const history = await getHistoryList();
    return res.json({ history, dbConnected: isDbConnected() });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve history.' });
  }
});

/**
 * GET /api/history/:id
 * Retrieves full single history record.
 */
router.get('/history/:id', async (req, res) => {
  try {
    const record = await getHistoryById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Analysis record not found.' });
    }
    return res.json(record);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load analysis record.' });
  }
});

/**
 * DELETE /api/history/:id
 * Deletes a history record.
 */
router.delete('/history/:id', async (req, res) => {
  try {
    const deleted = await deleteHistoryById(req.params.id);
    return res.json({ success: deleted });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete record.' });
  }
});

module.exports = router;
