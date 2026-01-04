const { parseResume } = require('../services/parseService');
const { generatePDFResume, generateDOCXResume } = require('../services/generateService');
const fs = require('fs');
const path = require('path');

// Upload and parse resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // Parse the resume
    const parsedContent = await parseResume(filePath, fileExt);

    // Return parsed content
    res.json({
      success: true,
      filename: req.file.originalname,
      filesize: req.file.size,
      content: parsedContent
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Failed to upload and parse resume',
      message: error.message
    });
  }
};

// Generate ATS-friendly resume
exports.generateAFriendlyResume = async (req, res) => {
  try {
    const { resumeData, format } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    if (!['pdf', 'docx'].includes(format)) {
      return res.status(400).json({ error: 'Format must be pdf or docx' });
    }

    let fileBuffer;
    let filename;
    let contentType;

    if (format === 'pdf') {
      fileBuffer = await generatePDFResume(resumeData);
      filename = 'ats-friendly-resume.pdf';
      contentType = 'application/pdf';
    } else {
      fileBuffer = await generateDOCXResume(resumeData);
      filename = 'ats-friendly-resume.docx';
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(fileBuffer);
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({
      error: 'Failed to generate resume',
      message: error.message
    });
  }
};
