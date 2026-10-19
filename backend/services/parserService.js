const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts raw text from uploaded buffer based on mimetype / filename extension.
 */
async function parseFileBuffer(buffer, filename, mimetype) {
  const lowerName = (filename || '').toLowerCase();
  
  if (mimetype === 'application/pdf' || lowerName.endsWith('.pdf')) {
    try {
      const pdfData = await pdfParse(buffer);
      if (pdfData && pdfData.text && pdfData.text.trim()) {
        return cleanText(pdfData.text);
      }
    } catch (err) {
      console.error('Error parsing PDF file:', err.message);
      throw new Error('Failed to parse PDF document. Ensure the file is not encrypted or corrupted.');
    }
  }

  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword' ||
    lowerName.endsWith('.docx') ||
    lowerName.endsWith('.doc')
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      if (result && result.value && result.value.trim()) {
        return cleanText(result.value);
      }
    } catch (err) {
      console.error('Error parsing DOCX file:', err.message);
      throw new Error('Failed to parse Word document. Please ensure it is a valid .docx file.');
    }
  }

  // Fallback to UTF-8 text interpretation
  try {
    const text = buffer.toString('utf-8');
    return cleanText(text);
  } catch (err) {
    throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT document.');
  }
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}

module.exports = { parseFileBuffer };
