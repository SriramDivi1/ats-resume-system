const express = require('express');
const { calculateAtsScore, compareResumeWithJD } = require('../controllers/scoringController');

const router = express.Router();

// Calculate ATS score
router.post('/calculate', calculateAtsScore);

// Compare resume with job description
router.post('/compare', compareResumeWithJD);

module.exports = router;
