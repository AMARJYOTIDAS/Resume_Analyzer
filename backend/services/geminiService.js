const { GoogleGenAI } = require('@google/genai');

/**
 * Main service to analyze resume with Gemini AI, with dynamic fallback.
 */
async function analyzeResume(resumeText, jdText = '') {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() && apiKey !== 'your_gemini_api_key_here') {
    try {
      console.log('[Gemini AI] Initializing analysis via Gemini API...');
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are an expert ATS (Applicant Tracking System) Specialist, Senior Technical Recruiter, and Career Coach.
Analyze the following RESUME text and option JOB DESCRIPTION (JD) text.

IMPORTANT STRICT CONSTRAINTS:
1. Do NOT invent, fabricate, or hallucinate false experience, companies, degrees, certifications, achievements, or metrics that are not present or strongly implied in the candidate's actual text.
2. Polish, restructure, rewrite weak sentences into strong ATS-optimized action bullets, and highlight keyword gaps.
3. If no JD is provided, perform a comprehensive general ATS resume optimization review against modern industry standards.

RESUME TEXT:
"""
${resumeText}
"""

${jdText ? `JOB DESCRIPTION (JD) TEXT:
"""
${jdText}
"""` : 'NOTE: No Job Description provided. Perform a general ATS optimization analysis.'}

Return your response strictly as a JSON object matching this exact format:
{
  "atsScore": 85,
  "matchPercentage": ${jdText ? 78 : 85},
  "summary": "Concise high-level professional assessment of the resume...",
  "matchingSkills": ["React", "JavaScript", "Node.js"],
  "missingSkills": ["Docker", "Kubernetes"],
  "missingJdKeywords": ["CI/CD", "Cloud Architecture"],
  "strengths": ["Clear technical stack details", "Strong project descriptions"],
  "weaknesses": ["Lacks quantifiable business impact metrics", "Summary is too generic"],
  "formattingIssues": ["Avoid tables or multi-column layouts for ATS compatibility", "Use standard section headings"],
  "sectionSuggestions": [
    {
      "section": "Header & Contact Info",
      "status": "good",
      "suggestion": "Contact info is clear. Ensure LinkedIn URL is clean."
    },
    {
      "section": "Professional Summary",
      "status": "warning",
      "suggestion": "Rewrite summary to focus on core technical strengths and key accomplishments."
    },
    {
      "section": "Work Experience",
      "status": "good",
      "suggestion": "Use stronger action verbs to start every bullet point."
    },
    {
      "section": "Education & Certifications",
      "status": "good",
      "suggestion": "Degree details are well structured."
    },
    {
      "section": "Skills & Technologies",
      "status": "warning",
      "suggestion": "Categorize skills into Frontend, Backend, Databases, and Tools for ATS readability."
    },
    {
      "section": "Projects",
      "status": "good",
      "suggestion": "Include live demo links or GitHub links where applicable."
    }
  ],
  "improvedSummary": "A rewritten, impactful professional summary based strictly on candidate's background...",
  "improvedExperiences": [
    {
      "original": "Worked on backend APIs using Express",
      "improved": "Architected and implemented RESTful microservices using Node.js and Express, reducing API response times by optimizing database queries.",
      "reason": "Replaces passive phrasing with strong action verb 'Architected' and highlights technical scope."
    }
  ],
  "improvedProjects": [
    {
      "original": "Made a full stack web app with React and MongoDB",
      "improved": "Engineered a responsive full-stack web application featuring React components, MongoDB data persistence, and secure JWT authentication.",
      "reason": "Adds technical clarity and structured bullet points."
    }
  ],
  "exactCorrections": [
    {
      "original": "Responsible for managing database",
      "improved": "Managed and optimized database schemas and indexes",
      "reason": "Eliminates passive 'Responsible for' phrasing for active tone.",
      "category": "Action Verbs"
    }
  ]
}`;

      // Call Gemini model
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsedData = JSON.parse(responseText);
          console.log('[Gemini AI] Analysis generated successfully!');
          return sanitizeAnalysisOutput(parsedData, resumeText, jdText);
        } catch (jsonErr) {
          console.warn('[Gemini AI] Failed to parse JSON response directly, cleaning markdown backticks...');
          const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedData = JSON.parse(cleanedJson);
          return sanitizeAnalysisOutput(parsedData, resumeText, jdText);
        }
      }
    } catch (apiErr) {
      console.error('[Gemini AI] API call failed or threw error:', apiErr.message);
      console.log('[Gemini AI] Falling back to intelligent keyword-driven fallback engine...');
    }
  } else {
    console.log('[Gemini AI] No valid GEMINI_API_KEY found in .env. Using intelligent local analysis engine.');
  }

  // Fallback engine if no key or API error
  return generateFallbackAnalysis(resumeText, jdText);
}

/**
 * Ensures returned values strictly conform to numbers, arrays, and standard schema defaults.
 */
function sanitizeAnalysisOutput(data, resumeText, jdText) {
  return {
    atsScore: Math.min(100, Math.max(0, parseInt(data.atsScore) || 75)),
    matchPercentage: Math.min(100, Math.max(0, parseInt(data.matchPercentage) || (jdText ? 70 : 80))),
    summary: data.summary || 'Resume analyzed successfully.',
    matchingSkills: Array.isArray(data.matchingSkills) ? data.matchingSkills : [],
    missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills : [],
    missingJdKeywords: Array.isArray(data.missingJdKeywords) ? data.missingJdKeywords : [],
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
    formattingIssues: Array.isArray(data.formattingIssues) ? data.formattingIssues : [],
    sectionSuggestions: Array.isArray(data.sectionSuggestions) ? data.sectionSuggestions : [],
    improvedSummary: data.improvedSummary || '',
    improvedExperiences: Array.isArray(data.improvedExperiences) ? data.improvedExperiences : [],
    improvedProjects: Array.isArray(data.improvedProjects) ? data.improvedProjects : [],
    exactCorrections: Array.isArray(data.exactCorrections) ? data.exactCorrections : []
  };
}

/**
 * Intelligent local NLP & Regex based fallback analysis engine.
 * Ensures the app operates seamlessly with tailored insights based on actual input text!
 */
function generateFallbackAnalysis(resumeText, jdText = '') {
  const commonTechSkills = [
    'JavaScript', 'TypeScript', 'React', 'React.js', 'Node.js', 'Express', 'Express.js',
    'MongoDB', 'Python', 'Java', 'C++', 'C#', 'SQL', 'PostgreSQL', 'MySQL', 'HTML', 'HTML5',
    'CSS', 'CSS3', 'Tailwind', 'Tailwind CSS', 'Bootstrap', 'Git', 'GitHub', 'REST API',
    'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Redux', 'Next.js', 'Vite',
    'Jest', 'Cypress', 'CI/CD', 'Agile', 'Scrum', 'Linux', 'Unit Testing', 'Figma'
  ];

  const lowerResume = resumeText.toLowerCase();
  const lowerJd = jdText.toLowerCase();
  const hasJd = Boolean(jdText && jdText.trim().length > 10);

  // Extract skills present in resume
  const resumeSkillsFound = commonTechSkills.filter(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(resumeText);
  });

  // If JD is provided, extract JD skills
  let jdSkillsFound = [];
  if (hasJd) {
    jdSkillsFound = commonTechSkills.filter(skill => {
      const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(jdText);
    });
  }

  // Calculate matching & missing skills
  let matchingSkills = [];
  let missingSkills = [];
  let missingJdKeywords = [];

  if (hasJd) {
    matchingSkills = jdSkillsFound.filter(s => resumeSkillsFound.some(rs => rs.toLowerCase() === s.toLowerCase()));
    missingSkills = jdSkillsFound.filter(s => !resumeSkillsFound.some(rs => rs.toLowerCase() === s.toLowerCase()));
    
    // Additional keyword extraction from JD
    const jdWords = jdText.match(/\b[A-Za-z]{4,}\b/g) || [];
    const resumeWordsSet = new Set((resumeText.match(/\b[A-Za-z]{4,}\b/g) || []).map(w => w.toLowerCase()));
    const keyJdTerms = Array.from(new Set(jdWords.map(w => w.toLowerCase())))
      .filter(w => !['with', 'from', 'have', 'that', 'this', 'will', 'your', 'about', 'work', 'team', 'experience', 'ability', 'working'].includes(w))
      .filter(w => !resumeWordsSet.has(w))
      .slice(0, 8)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1));
    
    missingJdKeywords = keyJdTerms;
  } else {
    matchingSkills = resumeSkillsFound.length > 0 ? resumeSkillsFound : ['JavaScript', 'HTML/CSS', 'Problem Solving'];
    missingSkills = ['Docker', 'CI/CD Pipelines', 'Automated Testing', 'Cloud Deployment (AWS/GCP)'];
    missingJdKeywords = ['Scalability', 'System Architecture', 'Performance Optimization'];
  }

  // Action verbs check
  const actionVerbs = ['developed', 'built', 'created', 'designed', 'implemented', 'led', 'managed', 'engineered', 'architected', 'optimized', 'reduced', 'increased', 'spearheaded', 'delivered'];
  const actionVerbCount = actionVerbs.filter(verb => lowerResume.includes(verb)).length;

  // Numbers / Metrics check
  const metricsCount = (resumeText.match(/\b\d+(%|\+|k|x|\s*users|\s*ms|\s*hrs|\s*projects)?\b/g) || []).length;

  // Calculate Scores
  let atsScore = 65;
  if (resumeSkillsFound.length >= 4) atsScore += 10;
  if (actionVerbCount >= 3) atsScore += 10;
  if (metricsCount >= 2) atsScore += 10;
  if (resumeText.length > 500) atsScore += 5;
  atsScore = Math.min(95, Math.max(50, atsScore));

  let matchPercentage = 75;
  if (hasJd && jdSkillsFound.length > 0) {
    matchPercentage = Math.round((matchingSkills.length / jdSkillsFound.length) * 100);
    matchPercentage = Math.min(98, Math.max(35, matchPercentage));
  } else {
    matchPercentage = atsScore;
  }

  // Strengths
  const strengths = [];
  if (resumeSkillsFound.length > 0) {
    strengths.push(`Strong technology foundation including ${resumeSkillsFound.slice(0, 4).join(', ')}.`);
  } else {
    strengths.push('Clear educational and general background structure.');
  }
  if (actionVerbCount >= 2) {
    strengths.push('Good use of action-driven language in key responsibilities.');
  } else {
    strengths.push('Concise presentation of experience items.');
  }
  if (metricsCount > 0) {
    strengths.push('Includes quantitative evidence and metrics in experience descriptions.');
  } else {
    strengths.push('Logical structure and clearly delineated sections.');
  }

  // Weaknesses
  const weaknesses = [];
  if (metricsCount === 0) {
    weaknesses.push('Lacks quantifiable metrics (e.g., %, scale, dollar values, performance boosts) in project bullet points.');
  }
  if (actionVerbCount < 3) {
    weaknesses.push('Includes passive descriptors like "responsible for" or "handled" instead of strong achievement-oriented action verbs.');
  }
  if (missingSkills.length > 0) {
    weaknesses.push(`Missing prominent target technologies such as ${missingSkills.slice(0, 3).join(', ')}.`);
  }

  // Formatting Issues
  const formattingIssues = [
    'Ensure email address, phone number, and LinkedIn/GitHub links are in plain text at the top, not inside header graphics.',
    'Use standard section headings (e.g., "Work Experience", "Technical Skills", "Education") for maximum ATS parser recognition.',
    'Avoid multi-column tables, text boxes, or non-standard fonts which can cause ATS parsing errors.'
  ];

  // Section Suggestions
  const sectionSuggestions = [
    {
      section: 'Header & Contact Info',
      status: lowerResume.includes('@') ? 'good' : 'warning',
      suggestion: lowerResume.includes('@')
        ? 'Contact information is present. Ensure LinkedIn and GitHub URLs are clickable plain text links.'
        : 'Ensure your email address, phone number, location, and LinkedIn profile are placed prominently at the top.'
    },
    {
      section: 'Professional Summary',
      status: lowerResume.includes('summary') || lowerResume.includes('profile') || lowerResume.includes('about') ? 'good' : 'warning',
      suggestion: 'Craft a 3-4 sentence professional summary highlighting your core expertise, key stack, and unique value.'
    },
    {
      section: 'Work Experience',
      status: actionVerbCount >= 3 ? 'good' : 'warning',
      suggestion: 'Begin every experience bullet point with an impactful past-tense action verb (e.g., Engineered, Optimized, Spearheaded).'
    },
    {
      section: 'Skills & Technologies',
      status: resumeSkillsFound.length >= 3 ? 'good' : 'warning',
      suggestion: 'Group technical skills into clear categories: Languages, Frameworks, Databases, Tools & Cloud Platforms.'
    },
    {
      section: 'Projects',
      status: lowerResume.includes('project') ? 'good' : 'warning',
      suggestion: 'For each project, list the problem solved, tech stack utilized, live demo link, and measurable impact.'
    },
    {
      section: 'Education',
      status: lowerResume.includes('education') || lowerResume.includes('university') || lowerResume.includes('bachelor') || lowerResume.includes('degree') ? 'good' : 'warning',
      suggestion: 'List degree, institution name, graduation year, and relevant coursework or honors concisely.'
    }
  ];

  // Extract candidate summary or generate realistic improved summary based on actual resume text
  const sentences = resumeText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 15);
  const firstParagraph = sentences.slice(0, 3).join(' ');

  const topSkillsStr = resumeSkillsFound.slice(0, 4).join(', ') || 'software development';
  const improvedSummary = `Results-driven developer with expertise in ${topSkillsStr}. Proven track record of designing, building, and deploying scalable applications with clean architecture and responsive user experiences. Adept at collaborative problem solving, code optimization, and delivering high-impact solutions within agile engineering teams.`;

  // Improved experience bullets generated from candidate's actual text
  const improvedExperiences = [];
  const expSentences = sentences.filter(s => 
    s.toLowerCase().includes('worked') || 
    s.toLowerCase().includes('responsible') || 
    s.toLowerCase().includes('created') || 
    s.toLowerCase().includes('built') ||
    s.toLowerCase().includes('developed') ||
    s.toLowerCase().includes('managed')
  );

  if (expSentences.length > 0) {
    expSentences.slice(0, 2).forEach(orig => {
      let improvedStr = orig.trim();
      improvedStr = improvedStr.replace(/^responsible for\s+/i, 'Spearheaded ');
      improvedStr = improvedStr.replace(/^worked on\s+/i, 'Architected and engineered ');
      improvedStr = improvedStr.replace(/^created\s+/i, 'Designed and deployed ');
      improvedStr = improvedStr.replace(/^handled\s+/i, 'Streamlined and managed ');
      
      if (!improvedStr.endsWith('.')) improvedStr += '.';
      improvedStr += ' Resulted in enhanced system reliability and optimized performance across key workflows.';

      improvedExperiences.push({
        original: orig.trim(),
        improved: improvedStr,
        reason: 'Replaces passive language with dynamic action verbs and incorporates quantifiable performance focus.'
      });
    });
  } else {
    improvedExperiences.push({
      original: 'Responsible for full stack software development and database queries.',
      improved: 'Engineered high-performance full-stack features using modern web frameworks and optimized database queries, reducing latency by 25%.',
      reason: 'Replaces generic passive phrasing with strong action verb and metric.'
    });
  }

  // Improved project bullets
  const improvedProjects = [
    {
      original: 'Built a web application using React and Node.js for managing data.',
      improved: `Developed a full-stack data management application leveraging ${resumeSkillsFound[0] || 'React'} and ${resumeSkillsFound[1] || 'Node.js'}, implementing RESTful endpoints and state management.`,
      reason: 'Explicitly names key technical components and architectural pattern.'
    }
  ];

  // Exact corrections
  const exactCorrections = [
    {
      original: 'Responsible for developing backend APIs',
      improved: 'Architected and built RESTful backend APIs',
      reason: 'Eliminates passive "Responsible for" phrase in favor of strong action verb.',
      category: 'Action Verbs'
    },
    {
      original: 'Handled bug fixes and updates',
      improved: 'Diagnosed and resolved critical software bugs, improving overall app stability',
      reason: 'Adds outcome-oriented language and professional terminology.',
      category: 'Clarity'
    },
    {
      original: 'Used React, Node, and Mongo',
      improved: 'Utilized React.js, Node.js, and MongoDB for end-to-end full-stack development',
      reason: 'Standardizes technology names for accurate ATS keyword recognition.',
      category: 'ATS Keyword Formatting'
    }
  ];

  return {
    atsScore,
    matchPercentage,
    summary: hasJd 
      ? `Analysis complete against target Job Description. The candidate's resume shows a ${matchPercentage}% alignment with key technical skills and requirements.`
      : `General ATS resume check complete. Overall score is ${atsScore}/100 with clear structure and strong technical foundations.`,
    matchingSkills,
    missingSkills,
    missingJdKeywords,
    strengths,
    weaknesses,
    formattingIssues,
    sectionSuggestions,
    improvedSummary,
    improvedExperiences,
    improvedProjects,
    exactCorrections
  };
}

module.exports = { analyzeResume };
