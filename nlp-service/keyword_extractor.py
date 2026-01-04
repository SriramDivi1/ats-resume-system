import re
from collections import Counter

# Tech skills database
TECH_SKILLS = {
    # Programming Languages
    'python', 'javascript', 'java', 'cpp', 'c++', 'csharp', 'c#', 'ruby', 'php', 'swift',
    'kotlin', 'go', 'rust', 'typescript', 'scala', 'perl', 'r', 'matlab', 'groovy',
    'dart', 'elixir', 'haskell', 'clojure', 'lua', 'bash', 'shell', 'powershell',
    
    # Frontend Technologies
    'react', 'angular', 'vue', 'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind',
    'jquery', 'webpack', 'gulp', 'grunt', 'npm', 'yarn', 'babel', 'next.js', 'nuxt',
    'svelte', 'ember', 'backbone',
    
    # Backend & Frameworks
    'nodejs', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails',
    'asp.net', 'fastapi', 'nestjs', 'nest.js', 'graphql', 'rest', 'api',
    
    # Databases
    'mongodb', 'mysql', 'postgresql', 'oracle', 'sql', 'cassandra', 'redis',
    'elasticsearch', 'dynamodb', 'firebase', 'couchdb', 'sqlite', 'mariadb',
    
    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github',
    'circleci', 'terraform', 'ansible', 'cloudformation', 'lambda', 'heroku',
    
    # Tools & Methodologies
    'git', 'linux', 'unix', 'windows', 'agile', 'scrum', 'jira', 'confluence',
    'selenium', 'junit', 'pytest', 'mocha', 'jest', 'vite',
    
    # Data Science & ML
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
    'pandas', 'numpy', 'spark', 'hadoop', 'data analysis', 'nlp', 'computer vision',
    'big data', 'etl', 'data pipeline', 'ml', 'ai', 'artificial intelligence'
}

def extract_keywords_from_text(text):
    """Extract technical keywords from text"""
    if not text:
        return []
    
    # Convert to lowercase
    text_lower = text.lower()
    
    # Remove special characters but keep spaces
    text_clean = re.sub(r'[^\w\s]', ' ', text_lower)
    
    # Find all matching skills
    found_skills = []
    for skill in TECH_SKILLS:
        # Use word boundary matching
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_clean):
            found_skills.append(skill)
    
    # Remove duplicates while preserving order
    return list(dict.fromkeys(found_skills))

def calculate_skill_match(resume_keywords, jd_keywords):
    """Calculate skill match percentage"""
    if not jd_keywords:
        return 0
    
    matched = set(resume_keywords) & set(jd_keywords)
    return (len(matched) / len(jd_keywords)) * 100

def get_missing_keywords(resume_keywords, jd_keywords):
    """Get keywords missing from resume"""
    resume_set = set(k.lower() for k in resume_keywords)
    jd_set = set(k.lower() for k in jd_keywords)
    
    missing = jd_set - resume_set
    return list(missing)

def get_matched_keywords(resume_keywords, jd_keywords):
    """Get keywords that match between resume and JD"""
    resume_set = set(k.lower() for k in resume_keywords)
    jd_set = set(k.lower() for k in jd_keywords)
    
    matched = resume_set & jd_set
    return list(matched)
