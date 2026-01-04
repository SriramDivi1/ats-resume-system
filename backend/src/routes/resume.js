const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadResume, generateAFriendlyResume } = require('../controllers/resumeController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || 10485760) }
});

// Upload and parse resume
router.post('/upload', upload.single('resume'), uploadResume);

// Generate ATS-friendly resume
router.post('/generate', generateAFriendlyResume);

module.exports = router;
