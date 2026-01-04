const mongoose = require('mongoose');

const scoreResultSchema = new mongoose.Schema({
  resumeFilename: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    default: 'Untitled Position'
  },
  jobDescription: {
    type: String,
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    required: true
  },
  scoreBreakdown: {
    skill_match: Number,
    role_keywords: Number,
    experience_relevance: Number,
    formatting_compliance: Number
  },
  matchedSkills: [String],
  missingSkills: [String],
  suggestions: [
    {
      priority: String,
      category: String,
      message: String
    }
  ],
  matchPercentage: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update updatedAt
scoreResultSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ScoreResult', scoreResultSchema);
