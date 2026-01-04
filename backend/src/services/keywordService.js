// Common technical skills database
const TECH_SKILLS = [
  // Programming Languages
  'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust',
  'typescript', 'scala', 'perl', 'r', 'matlab', 'groovy', 'dart', 'elixir', 'haskell',
  
  // Frontend
  'react', 'angular', 'vue', 'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind',
  'jquery', 'webpack', 'gulp', 'grunt', 'npm', 'yarn', 'babel',
  
  // Backend
  'nodejs', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net',
  'fastapi', 'nest.js', 'graphql', 'rest api', 'restful',
  
  // Databases
  'mongodb', 'mysql', 'postgresql', 'oracle', 'sql server', 'cassandra', 'redis',
  'elasticsearch', 'dynamodb', 'firebase', 'couchdb', 'sqlite',
  
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'gitlab',
  'github', 'circleci', 'terraform', 'ansible', 'cloudformation', 'lambda',
  
  // Tools & Frameworks
  'git', 'linux', 'unix', 'windows', 'agile', 'scrum', 'jira', 'confluence',
  'selenium', 'junit', 'pytest', 'mocha', 'jest', 'webpack', 'vite',
  
  // Data & AI
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
  'pandas', 'numpy', 'spark', 'hadoop', 'data analysis', 'nlp', 'computer vision',
  'big data', 'etl', 'data pipeline'
];

// Extract keywords from text
exports.extractKeywords = (text) => {
  if (!text) return [];

  // Convert to lowercase
  const lowerText = text.toLowerCase();

  // Find matching skills
  const matchedSkills = TECH_SKILLS.filter(skill => {
    // Create regex pattern with word boundaries
    const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    return pattern.test(lowerText);
  });

  // Remove duplicates and return
  return [...new Set(matchedSkills)];
};

// Normalize text for better keyword extraction
exports.normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

// Extract experience level from text
exports.extractExperienceLevel = (text) => {
  const lowerText = text.toLowerCase();

  if (/\b(cto|cfo|ceo|chief|director|principal)\b/.test(lowerText)) {
    return 'executive';
  }
  if (/\b(senior|lead|staff|architect)\b/.test(lowerText)) {
    return 'senior';
  }
  if (/\b(mid|intermediate|mid-level)\b/.test(lowerText)) {
    return 'mid-level';
  }
  if (/\b(junior|entry|entry-level|graduate|intern)\b/.test(lowerText)) {
    return 'junior';
  }

  return 'unknown';
};

module.exports = exports;
