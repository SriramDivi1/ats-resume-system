import React from 'react';

function Suggestions({ suggestions }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#F44336';
      case 'high':
        return '#FF9800';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#2196F3';
    }
  };

  return (
    <div className="suggestions-container">
      <h3>Improvement Suggestions</h3>
      <div className="suggestions-list">
        {suggestions.map((suggestion, idx) => (
          <div key={idx} className="suggestion-item">
            <div
              className="suggestion-priority"
              style={{ backgroundColor: getPriorityColor(suggestion.priority) }}
            >
              {suggestion.priority.toUpperCase()}
            </div>
            <div className="suggestion-content">
              <h4>{suggestion.category}</h4>
              <p>{suggestion.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Suggestions;
