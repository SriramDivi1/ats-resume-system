from keyword_extractor import (
    extract_keywords_from_text,
    calculate_skill_match,
    get_missing_keywords,
    get_matched_keywords
)
import re

def calculate_ats_score(resume_text, job_description):
    """
    Calculate comprehensive ATS score
    
    Score breakdown:
    - Skill match: 60%
    - Role keywords: 15%
    - Experience relevance: 15%
    - Formatting compliance: 10%
    """
    
    # Extract keywords
    resume_keywords = extract_keywords_from_text(resume_text)
    jd_keywords = extract_keywords_from_text(job_description)
    
    # 1. Skill Match (60%)
    skill_match = calculate_skill_match(resume_keywords, jd_keywords)
    skill_score = skill_match * 0.6
    
    # 2. Role Keywords (15%)
    role_keywords = ['developer', 'engineer', 'architect', 'manager', 'analyst',
                     'designer', 'data scientist', 'devops', 'qa', 'tester']
    resume_roles = [k for k in resume_keywords if any(r in k.lower() for r in role_keywords)]
    jd_roles = [k for k in jd_keywords if any(r in k.lower() for r in role_keywords)]
    role_match = (len(set(resume_roles) & set(jd_roles)) / len(set(jd_roles))) * 100 if jd_roles else 0
    role_score = role_match * 0.15
    
    # 3. Experience Relevance (15%)
    years_pattern = r'(\d+)\s*(?:years?|yrs?)'
    resume_years = extract_years_of_experience(resume_text)
    experience_score = min(resume_years, 10) * 1.5  # Max 15 points
    
    # 4. Formatting Compliance (10%)
    format_score = check_formatting_compliance(resume_text) * 10
    
    # Calculate total score
    total_score = min(skill_score + role_score + experience_score + format_score, 100)
    
    # Get suggestions
    suggestions = generate_suggestions(
        resume_keywords, jd_keywords, resume_text, job_description
    )
    
    # Get matched and missing skills
    matched_skills = get_matched_keywords(resume_keywords, jd_keywords)
    missing_skills = get_missing_keywords(resume_keywords, jd_keywords)
    
    return {
        'ats_score': round(total_score, 2),
        'score_breakdown': {
            'skill_match': round(skill_score, 2),
            'role_keywords': round(role_score, 2),
            'experience_relevance': round(experience_score, 2),
            'formatting_compliance': round(format_score, 2)
        },
        'matched_skills': matched_skills[:20],  # Top 20
        'missing_skills': missing_skills[:20],  # Top 20
        'suggestions': suggestions,
        'match_percentage': round(skill_match, 2)
    }

def compare_resume_jd(resume_text, job_description):
    """Compare resume with job description"""
    
    resume_keywords = extract_keywords_from_text(resume_text)
    jd_keywords = extract_keywords_from_text(job_description)
    
    matched = get_matched_keywords(resume_keywords, jd_keywords)
    missing = get_missing_keywords(resume_keywords, jd_keywords)
    
    match_score = (len(matched) / len(jd_keywords) * 100) if jd_keywords else 0
    
    return {
        'matched_skills': matched[:20],
        'missing_skills': missing[:20],
        'match_percentage': round(match_score, 2),
        'total_jd_skills': len(jd_keywords),
        'total_resume_skills': len(resume_keywords)
    }

def extract_years_of_experience(text):
    """Extract years of experience from text"""
    pattern = r'(\d+)\s*(?:years?|yrs?)'
    matches = re.findall(pattern, text, re.IGNORECASE)
    
    if matches:
        # Return the highest mentioned year
        return max(int(m) for m in matches)
    
    return 0

def check_formatting_compliance(text):
    """Check if resume follows ATS-friendly formatting (0-1 score)"""
    score = 0
    max_score = 5
    
    # Check for common section headings
    sections = ['experience', 'education', 'skills', 'summary', 'contact']
    found_sections = 0
    for section in sections:
        if re.search(rf'\b{section}\b', text, re.IGNORECASE):
            found_sections += 1
    
    if found_sections >= 3:
        score += 2
    
    # Check for common date formats (YYYY-MM or Month Year)
    if re.search(r'\d{4}[-/]\d{2}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4}', text, re.IGNORECASE):
        score += 1
    
    # Check for email format
    if re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text):
        score += 1
    
    # Check for phone format
    if re.search(r'[\d\-\(\)\s]{7,}', text):
        score += 1
    
    # Check text is not too dense (reasonable line breaks)
    lines = text.split('\n')
    if len(lines) > 10:
        score += 1
    
    return min(score / max_score, 1.0)

def generate_suggestions(resume_keywords, jd_keywords, resume_text, job_description):
    """Generate actionable improvement suggestions"""
    suggestions = []
    
    missing_skills = get_missing_keywords(resume_keywords, jd_keywords)
    
    # Suggestion 1: Add missing high-priority skills
    if missing_skills:
        high_priority = missing_skills[:5]
        suggestions.append({
            'priority': 'high',
            'category': 'Missing Skills',
            'message': f'Add missing skills: {", ".join(high_priority)} to your resume.'
        })
    
    # Suggestion 2: Skills match quality
    matched_skills = get_matched_keywords(resume_keywords, jd_keywords)
    if not matched_skills:
        suggestions.append({
            'priority': 'critical',
            'category': 'Skills Gap',
            'message': 'Your resume shares very few skills with the job description. Consider gaining or highlighting relevant skills.'
        })
    elif len(matched_skills) / len(jd_keywords) < 0.5:
        suggestions.append({
            'priority': 'high',
            'category': 'Skills Match',
            'message': f'You have {len(matched_skills)} matching skills. Try to highlight more relevant skills from your experience.'
        })
    else:
        suggestions.append({
            'priority': 'low',
            'category': 'Skills Match',
            'message': f'Good skill alignment! You have {len(matched_skills)} matching skills with the job description.'
        })
    
    # Suggestion 3: Formatting check
    years = extract_years_of_experience(resume_text)
    if years == 0:
        suggestions.append({
            'priority': 'medium',
            'category': 'Experience Clarity',
            'message': 'Make sure to clearly mention years of experience in your resume.'
        })
    
    # Suggestion 4: Specific roles mentioned
    if 'experience' not in resume_text.lower():
        suggestions.append({
            'priority': 'medium',
            'category': 'Structure',
            'message': 'Add a clear "Experience" or "Professional Experience" section to your resume.'
        })
    
    if 'education' not in resume_text.lower():
        suggestions.append({
            'priority': 'medium',
            'category': 'Structure',
            'message': 'Include an "Education" section in your resume.'
        })
    
    # Suggestion 5: Contact information
    if '@' not in resume_text and '(' not in resume_text:
        suggestions.append({
            'priority': 'high',
            'category': 'Contact Information',
            'message': 'Ensure your email address and phone number are clearly listed in your resume.'
        })
    
    return suggestions[:5]  # Return top 5 suggestions
