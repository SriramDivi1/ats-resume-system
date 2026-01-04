import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const fetchHistory = async (pageNum) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/history?page=${pageNum}&limit=10`);
      setHistory(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      setError('Failed to load history');
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this result?')) {
      try {
        await axios.delete(`${API_BASE_URL}/history/${id}`);
        setHistory(history.filter(item => item._id !== id));
        setSelectedResult(null);
      } catch (err) {
        alert('Failed to delete result');
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all history? This cannot be undone.')) {
      try {
        await axios.delete(`${API_BASE_URL}/history`);
        setHistory([]);
        setSelectedResult(null);
        setPage(1);
      } catch (err) {
        alert('Failed to clear history');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    if (score >= 40) return '#FF9800';
    return '#F44336';
  };

  if (loading && history.length === 0) {
    return (
      <div className="history-container">
        <h2>Scoring History</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Scoring History</h2>
        {history.length > 0 && (
          <button className="clear-all-btn" onClick={handleClearAll}>
            Clear All
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {history.length === 0 ? (
        <div className="no-history">
          <p>No results yet. Start by uploading a resume and calculating your ATS score!</p>
        </div>
      ) : (
        <div className="history-content">
          <div className="history-list">
            {history.map((result) => (
              <div
                key={result._id}
                className={`history-item ${selectedResult?._id === result._id ? 'selected' : ''}`}
                onClick={() => setSelectedResult(result)}
              >
                <div className="history-item-header">
                  <div className="history-item-title">
                    <h4>{result.jobTitle}</h4>
                    <p className="history-filename">{result.resumeFilename}</p>
                  </div>
                  <div className="history-item-score" style={{ borderColor: getScoreColor(result.atsScore) }}>
                    <span className="score-number">{result.atsScore}</span>
                  </div>
                </div>
                <div className="history-item-footer">
                  <span className="history-date">{formatDate(result.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedResult && (
            <div className="history-detail">
              <div className="detail-header">
                <h3>{selectedResult.jobTitle}</h3>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(selectedResult._id)}
                >
                  Delete
                </button>
              </div>

              <div className="detail-score">
                <div className="score-circle" style={{ borderColor: getScoreColor(selectedResult.atsScore) }}>
                  <div className="score-value">{selectedResult.atsScore}</div>
                </div>
                <div className="detail-meta">
                  <p><strong>Resume:</strong> {selectedResult.resumeFilename}</p>
                  <p><strong>Date:</strong> {formatDate(selectedResult.createdAt)}</p>
                  <p><strong>Match:</strong> {selectedResult.matchPercentage.toFixed(1)}%</p>
                </div>
              </div>

              <div className="detail-breakdown">
                <h4>Score Breakdown</h4>
                <div className="breakdown-grid">
                  <div className="breakdown-item">
                    <span>Skill Match</span>
                    <span className="value">{selectedResult.scoreBreakdown.skill_match.toFixed(1)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Role Keywords</span>
                    <span className="value">{selectedResult.scoreBreakdown.role_keywords.toFixed(1)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Experience</span>
                    <span className="value">{selectedResult.scoreBreakdown.experience_relevance.toFixed(1)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Formatting</span>
                    <span className="value">{selectedResult.scoreBreakdown.formatting_compliance.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {selectedResult.matchedSkills.length > 0 && (
                <div className="detail-skills">
                  <h4>Matched Skills ({selectedResult.matchedSkills.length})</h4>
                  <div className="skills-list">
                    {selectedResult.matchedSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag matched">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedResult.missingSkills.length > 0 && (
                <div className="detail-skills">
                  <h4>Missing Skills ({selectedResult.missingSkills.length})</h4>
                  <div className="skills-list">
                    {selectedResult.missingSkills.slice(0, 10).map((skill, idx) => (
                      <span key={idx} className="skill-tag missing">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="page-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default History;
