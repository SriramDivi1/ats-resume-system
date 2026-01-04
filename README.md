# ATS-Friendly Resume Builder & Role-Based Resume Scoring System

## Problem Statement

Applicant Tracking Systems (ATS) scan resumes for specific keywords, formatting, and structure. Many qualified candidates are rejected at the ATS stage because their resumes don't match the system's parsing requirements. This system helps job seekers optimize their resumes to pass ATS screening and align their qualifications with job descriptions.

## Solution

A comprehensive web application that:
- Accepts resume uploads (PDF/DOCX)
- Analyzes job descriptions
- Extracts and compares skills and experience
- Generates an ATS match score (0-100)
- Identifies missing keywords
- Provides actionable improvement suggestions
- Generates optimized ATS-friendly resumes

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│                    UI on Port 3000                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ REST API Calls
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                   Backend API (Node.js)                      │
│                  Express on Port 5000                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Routes: /api/resume, /api/scoring                  │    │
│  │ Controllers: Resume, Scoring                        │    │
│  │ Services: Parse, Generate, Keywords                │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP Calls
                  │
┌─────────────────▼───────────────────────────────────────────┐
│            NLP Service (Python + Flask)                      │
│               Flask on Port 6000                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Routes: /score, /compare, /extract-keywords        │    │
│  │ Services: Keyword Extraction, ATS Scoring          │    │
│  │ Engine: TF-IDF + Cosine Similarity                 │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React** 18 - UI framework
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

### Backend API
- **Node.js** - Runtime
- **Express** - Web framework
- **Multer** - File upload handling
- **pdf-parse** - PDF parsing
- **Mammoth** - DOCX parsing
- **PDFKit** - PDF generation
- **docx** - DOCX generation

### NLP Service
- **Python 3.10** - Language
- **Flask** - Web framework
- **Scikit-learn** - ML algorithms (TF-IDF, Cosine Similarity)
- **NumPy & Pandas** - Data processing

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Multi-stage builds** - Optimized images

## ATS Scoring Logic

### Score Components

```
Total Score (0-100) = Skill Match (60%) + Role Keywords (15%) 
                      + Experience Relevance (15%) 
                      + Formatting Compliance (10%)
```

#### 1. Skill Match (60%)
- Extracts technical skills from resume and JD
- Uses keyword matching against extensive skill database
- Calculates percentage of JD skills found in resume

#### 2. Role Keywords (15%)
- Identifies role-specific keywords (developer, engineer, manager, etc.)
- Matches role consistency between resume and JD

#### 3. Experience Relevance (15%)
- Extracts years of experience mentioned
- Cross-references with JD requirements
- Maximum 15 points for senior roles

#### 4. Formatting Compliance (10%)
- Checks for standard section headings
- Validates date format consistency
- Verifies contact information presence
- Checks overall structure and readability

## API Endpoints

### Backend API (Port 5000)

#### Health Check
```bash
GET /api/health
```

#### Resume Upload
```bash
POST /api/resume/upload
Content-Type: multipart/form-data

Request: Binary file (PDF/DOCX)
Response: {
  "success": true,
  "filename": "resume.pdf",
  "filesize": 25600,
  "content": "Extracted text content..."
}
```

#### Calculate ATS Score
```bash
POST /api/scoring/calculate
Content-Type: application/json

Request: {
  "resumeText": "John Doe...",
  "jobDescription": "Senior Developer required..."
}

Response: {
  "ats_score": 78.5,
  "score_breakdown": {
    "skill_match": 46.8,
    "role_keywords": 13.2,
    "experience_relevance": 14.1,
    "formatting_compliance": 9.2
  },
  "matched_skills": ["Python", "React", "Node.js", ...],
  "missing_skills": ["Docker", "Kubernetes", ...],
  "suggestions": [
    {
      "priority": "high",
      "category": "Missing Skills",
      "message": "Add missing skills: Docker, Kubernetes..."
    },
    ...
  ],
  "match_percentage": 85.0
}
```

#### Compare Resume with JD
```bash
POST /api/scoring/compare
Content-Type: application/json

Request: {
  "resumeText": "...",
  "jobDescription": "..."
}

Response: {
  "matched_skills": ["Python", "React", ...],
  "missing_skills": ["Docker", ...],
  "match_percentage": 85.0,
  "total_jd_skills": 20,
  "total_resume_skills": 15
}
```

#### Generate ATS-Friendly Resume
```bash
POST /api/resume/generate
Content-Type: application/json

Request: {
  "resumeData": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-234-567-8900",
    "summary": "...",
    "skills": ["Python", "React", ...],
    "experience": [...],
    "education": [...]
  },
  "format": "pdf"
}

Response: Binary file (PDF or DOCX)
```

### NLP Service (Port 6000)

#### Health Check
```bash
GET /health
```

#### Score Resume
```bash
POST /score
Content-Type: application/json

Request: {
  "resume_text": "...",
  "job_description": "..."
}

Response: Full ATS scoring response (see backend endpoint)
```

#### Compare Resume with JD
```bash
POST /compare
Content-Type: application/json

Request: {
  "resume_text": "...",
  "job_description": "..."
}

Response: Comparison results
```

#### Extract Keywords
```bash
POST /extract-keywords
Content-Type: application/json

Request: {
  "text": "..."
}

Response: {
  "keywords": ["Python", "React", ...],
  "count": 15
}
```

## Quick Start Guide

### Prerequisites
- Docker & Docker Compose installed
- 2GB RAM minimum
- 500MB disk space

### Local Development (Without Docker)

#### 1. Setup Backend
```bash
cd backend
npm install
node src/app.js
# Runs on http://localhost:5000
```

#### 2. Setup NLP Service
```bash
cd nlp-service
pip install -r requirements.txt
python app.py
# Runs on http://localhost:6000
```

#### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Production Deployment (Docker)

#### 1. Build and Start All Services
```bash
docker-compose up --build
```

#### 2. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health
- NLP Service: http://localhost:6000/health

#### 3. Stop Services
```bash
docker-compose down
```

#### 4. View Logs
```bash
docker-compose logs -f [service-name]
docker-compose logs -f backend
docker-compose logs -f nlp-service
docker-compose logs -f frontend
```

## Configuration

### Environment Variables

#### Backend (.env)
```
NODE_ENV=production
PORT=5000
NLP_SERVICE_URL=http://nlp-service:6000
UPLOAD_FOLDER=./uploads
MAX_FILE_SIZE=10485760
```

#### NLP Service (.env)
```
PORT=6000
DEBUG=False
```

## File Structure

```
ats-resume-system/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── routes/
│   │   │   ├── resume.js          # Resume upload routes
│   │   │   └── scoring.js         # Scoring routes
│   │   ├── controllers/
│   │   │   ├── resumeController.js # Resume logic
│   │   │   └── scoringController.js # Scoring logic
│   │   ├── services/
│   │   │   ├── parseService.js    # PDF/DOCX parsing
│   │   │   ├── generateService.js # PDF/DOCX generation
│   │   │   └── keywordService.js  # Keyword extraction
│   │   └── utils/
│   ├── uploads/                   # Resume uploads directory
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── nlp-service/
│   ├── app.py                     # Flask app
│   ├── scoring_engine.py          # ATS scoring logic
│   ├── keyword_extractor.py       # Keyword extraction
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                 # Main app component
│   │   ├── index.js               # Entry point
│   │   ├── components/
│   │   │   ├── ResumeUploader.js
│   │   │   ├── JobDescriptionInput.js
│   │   │   ├── ScoreDisplay.js
│   │   │   ├── Suggestions.js
│   │   │   └── ResumePreviewer.js
│   │   └── styles/
│   │       └── app.css
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Sample API Requests

### Upload Resume (cURL)
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@resume.pdf" \
  -H "Accept: application/json"
```

### Calculate ATS Score (cURL)
```bash
curl -X POST http://localhost:5000/api/scoring/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "John Doe\nSenior Python Developer\nSkills: Python, React, Node.js, Docker",
    "jobDescription": "We seek a Senior Developer with 5+ years experience in Python, React, Docker, and Kubernetes. Must have strong backend skills."
  }'
```

### Extract Keywords (cURL)
```bash
curl -X POST http://localhost:6000/extract-keywords \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Senior Python and React developer with 7 years of experience in building scalable web applications using Node.js and Docker."
  }'
```

## Performance Metrics

- **Resume Upload**: < 2 seconds
- **ATS Score Calculation**: < 1 second
- **Resume Generation**: < 3 seconds
- **Max File Size**: 10MB
- **Concurrent Users**: Scales with Docker Compose

## Troubleshooting

### Services Not Starting
```bash
# Check port availability
netstat -tuln | grep LISTEN

# Check Docker logs
docker-compose logs nlp-service
docker-compose logs backend
docker-compose logs frontend
```

### Resume Upload Fails
- Ensure file is valid PDF or DOCX
- Check file size < 10MB
- Verify uploads directory has write permissions

### Low ATS Score
- Add more relevant skills to your resume
- Use technical keywords from the job description
- Include quantifiable experience
- Use standard section headings

## Deployment to Production

### Docker Hub Deployment
```bash
# Build images
docker-compose build

# Tag images
docker tag ats-resume-system_backend [username]/ats-backend:latest
docker tag ats-resume-system_nlp-service [username]/ats-nlp:latest
docker tag ats-resume-system_frontend [username]/ats-frontend:latest

# Push to Docker Hub
docker push [username]/ats-backend:latest
docker push [username]/ats-nlp:latest
docker push [username]/ats-frontend:latest
```

### Kubernetes Deployment
Create deployment manifests for Kubernetes:
- ConfigMaps for environment variables
- Persistent Volumes for uploads
- Services for load balancing
- Ingress for external access

### Cloud Deployment (AWS/Azure/GCP)
- Use managed container services (ECS, AKS, Cloud Run)
- Configure auto-scaling based on load
- Set up monitoring and alerts
- Use CDN for frontend assets

## Future Enhancements

- [ ] Multi-language support
- [ ] Resume database with candidate tracking
- [ ] Email notifications for score improvements
- [ ] Batch processing for multiple resumes
- [ ] Integration with job boards (LinkedIn, Indeed)
- [ ] Advanced ML model using transformers (BERT)
- [ ] Resume templates and builders
- [ ] Interview preparation module
- [ ] Analytics dashboard
- [ ] Mobile application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact: support@ats-resume-scorer.com
- Documentation: https://ats-resume-scorer.com/docs

## Disclaimer

This tool is designed to help optimize resumes for ATS systems. However:
- Not all ATS systems are identical
- Some companies may use custom ATS configurations
- A high ATS score doesn't guarantee an interview
- Use this as one of many tools in your job search strategy

---

**Last Updated**: January 4, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
