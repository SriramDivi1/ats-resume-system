import React from 'react';

function JobDescriptionInput({ onChange, onTitleChange }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleTitleChange = (e) => {
    if (onTitleChange) {
      onTitleChange(e.target.value);
    }
  };

  return (
    <div className="component">
      <h2>Job Description</h2>
      <input
        type="text"
        className="job-title-input"
        placeholder="Job Title (optional)"
        onChange={handleTitleChange}
      />
      <textarea
        className="textarea"
        placeholder="Paste the job description here. Include required skills, experience, and responsibilities."
        onChange={handleChange}
        rows="10"
      />
    </div>
  );
}

export default JobDescriptionInput;
