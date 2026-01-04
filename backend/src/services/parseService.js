const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// Parse resume based on file type
exports.parseResume = async (filePath, fileExt) => {
  try {
    let text = '';

    if (fileExt === '.pdf') {
      text = await parsePDF(filePath);
    } else if (fileExt === '.docx') {
      text = await parseDOCX(filePath);
    } else {
      throw new Error('Unsupported file format. Only PDF and DOCX are supported.');
    }

    // Clean and normalize text
    text = normalizeText(text);

    return text;
  } catch (error) {
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};

// Parse PDF file
async function parsePDF(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(fileBuffer);
  return data.text;
}

// Parse DOCX file
async function parseDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

// Normalize text (remove extra whitespace, standardize formatting)
function normalizeText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
}

module.exports = exports;
