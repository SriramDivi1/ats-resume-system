import React, { useState, useRef } from 'react';
import axios from 'axios';
import './styles/app.css';
import ResumeUploader from './components/ResumeUploader';
import JobDescriptionInput from './components/JobDescriptionInput';
import ScoreDisplay from './components/ScoreDisplay';
import Suggestions from './components/Suggestions';
import ResumePreviewer from './components/ResumePreviewer';
import History from './components/History';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [resumeFilename, setResumeFilename] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const handleResumeUpload = async (text, filename) => {
    setResumeText(text);
    setResumeFilename(filename);
    setError('');
  };

  const handleJobDescriptionChange = (text) => {
    setJobDescription(text);
  };

  const handleJobTitleChange = (title) => {
    setJobTitle(title);
  };

  const handleCalculateScore = async () => {
    if (!resumeText || !jobDescription) {
      setError('Please provide both resume and job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/scoring/calculate`, {
        resumeText,
        jobDescription,
        resumeFilename,
        jobTitle
      });

      setScore(response.data);
      setActiveTab('results');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate score. Please try again.');
      console.error('Score calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async (format) => {
    // This would be implemented for resume generation
    console.log('Generate resume in format:', format);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ATS Resume Scorer</h1>
        <p>Optimize your resume for Applicant Tracking Systems</p>
      </header>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload & Score
        </button>
        {score && (
          <button
            className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Results
          </button>
        )}
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <main className="main-content">
        {activeTab === 'upload' && (
          <div className="upload-section">
            <div className="form-row">
              <div className="form-column">
                <ResumeUploader onUpload={handleResumeUpload} />
              </div>
              <div className="form-column">
                <JobDescriptionInput onChange={handleJobDescriptionChange} onTitleChange={handleJobTitleChange} />
              </div>
            </div>

            <button
              className="submit-button"
              onClick={handleCalculateScore}
              disabled={loading || !resumeText || !jobDescription}
            >
              {loading ? 'Calculating...' : 'Calculate ATS Score'}
            </button>
          </div>
        )}

        {activeTab === 'results' && score && (
          <div className="results-section">
            <ScoreDisplay score={score} />
            <Suggestions suggestions={score.suggestions} />
            <div className="matched-skills">
              <h3>Matched Skills ({score.matched_skills.length})</h3>
              <div className="skills-list">
                {score.matched_skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag matched">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="missing-skills">
              <h3>Missing Skills ({score.missing_skills.length})</h3>
              <div className="skills-list">
                {score.missing_skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag missing">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <History />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 ATS Resume Scorer. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
