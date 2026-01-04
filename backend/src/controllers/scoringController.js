const axios = require('axios');
const { extractKeywords } = require('../services/keywordService');
const ScoreResult = require('../models/ScoreResult');

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://localhost:6000';

// Calculate ATS score
exports.calculateAtsScore = async (req, res) => {
  try {
    const { resumeText, jobDescription, jobTitle, resumeFilename } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Resume text and job description are required' });
    }

    // Call NLP service to get scoring details
    const response = await axios.post(`${NLP_SERVICE_URL}/score`, {
      resume_text: resumeText,
      job_description: jobDescription
    });

    // Save to MongoDB for history
    try {
      const scoreResult = new ScoreResult({
        resumeFilename: resumeFilename || 'Resume',
        jobTitle: jobTitle || 'Untitled Position',
        jobDescription,
        resumeText,
        atsScore: response.data.ats_score,
        scoreBreakdown: response.data.score_breakdown,
        matchedSkills: response.data.matched_skills,
        missingSkills: response.data.missing_skills,
        suggestions: response.data.suggestions,
        matchPercentage: response.data.match_percentage
      });

      await scoreResult.save();
      response.data.resultId = scoreResult._id;
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Don't fail the request if database save fails
    }

    res.json(response.data);
  } catch (error) {
    console.error('Scoring error:', error);
    res.status(500).json({
      error: 'Failed to calculate ATS score',
      message: error.message
    });
  }
};

// Compare resume with job description
exports.compareResumeWithJD = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Resume text and job description are required' });
    }

    // Extract keywords from both
    const resumeKeywords = extractKeywords(resumeText);
    const jdKeywords = extractKeywords(jobDescription);

    // Find matched and missing skills
    const matchedSkills = resumeKeywords.filter(skill =>
      jdKeywords.some(jdSkill => 
        skill.toLowerCase() === jdSkill.toLowerCase()
      )
    );

    const missingSkills = jdKeywords.filter(skill =>
      !resumeKeywords.some(rSkill => 
        skill.toLowerCase() === rSkill.toLowerCase()
      )
    );

    res.json({
      success: true,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      match_percentage: resumeKeywords.length > 0 
        ? Math.round((matchedSkills.length / jdKeywords.length) * 100)
        : 0
    });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({
      error: 'Failed to compare resume with JD',
      message: error.message
    });
  }
};
