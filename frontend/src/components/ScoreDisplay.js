import React from 'react';

function ScoreDisplay({ score }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FFC107'; // Amber
    if (score >= 40) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="score-display">
      <div className="score-circle" style={{ borderColor: getScoreColor(score.ats_score) }}>
        <div className="score-value">{score.ats_score}</div>
        <div className="score-label">{getScoreLabel(score.ats_score)}</div>
      </div>

      <div className="score-breakdown">
        <h3>Score Breakdown</h3>
        <div className="breakdown-item">
          <span>Skill Match (60%)</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(score.score_breakdown.skill_match / 60) * 100}%` }}
            />
          </div>
          <span className="score-value">{score.score_breakdown.skill_match.toFixed(1)}</span>
        </div>

        <div className="breakdown-item">
          <span>Role Keywords (15%)</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(score.score_breakdown.role_keywords / 15) * 100}%` }}
            />
          </div>
          <span className="score-value">{score.score_breakdown.role_keywords.toFixed(1)}</span>
        </div>

        <div className="breakdown-item">
          <span>Experience Relevance (15%)</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(score.score_breakdown.experience_relevance / 15) * 100}%` }}
            />
          </div>
          <span className="score-value">{score.score_breakdown.experience_relevance.toFixed(1)}</span>
        </div>

        <div className="breakdown-item">
          <span>Formatting Compliance (10%)</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(score.score_breakdown.formatting_compliance / 10) * 100}%` }}
            />
          </div>
          <span className="score-value">{score.score_breakdown.formatting_compliance.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export default ScoreDisplay;
