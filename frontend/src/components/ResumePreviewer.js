import React from 'react';

function ResumePreviewer({ resumeData }) {
  if (!resumeData) return null;

  return (
    <div className="resume-previewer">
      <h3>Resume Preview</h3>
      <div className="resume-content">
        {resumeData.name && <h2>{resumeData.name}</h2>}
        {resumeData.email && <p>Email: {resumeData.email}</p>}
        {resumeData.phone && <p>Phone: {resumeData.phone}</p>}
        
        {resumeData.summary && (
          <div>
            <h4>Summary</h4>
            <p>{resumeData.summary}</p>
          </div>
        )}

        {resumeData.skills && (
          <div>
            <h4>Skills</h4>
            <p>{resumeData.skills.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumePreviewer;
