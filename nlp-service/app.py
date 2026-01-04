from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from scoring_engine import calculate_ats_score, compare_resume_jd

load_dotenv()

app = Flask(__name__)
CORS(app)

PORT = os.getenv('PORT', 6000)
DEBUG = os.getenv('DEBUG', 'False') == 'True'

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'NLP Service is running'}), 200

@app.route('/score', methods=['POST'])
def score_resume():
    """Calculate ATS score for resume"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        resume_text = data.get('resume_text', '')
        job_description = data.get('job_description', '')
        
        if not resume_text or not job_description:
            return jsonify({'error': 'resume_text and job_description are required'}), 400
        
        # Calculate score
        result = calculate_ats_score(resume_text, job_description)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/compare', methods=['POST'])
def compare():
    """Compare resume with job description"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        resume_text = data.get('resume_text', '')
        job_description = data.get('job_description', '')
        
        if not resume_text or not job_description:
            return jsonify({'error': 'resume_text and job_description are required'}), 400
        
        # Compare
        result = compare_resume_jd(resume_text, job_description)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/extract-keywords', methods=['POST'])
def extract_keywords():
    """Extract keywords from text"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'text is required'}), 400
        
        from keyword_extractor import extract_keywords_from_text
        keywords = extract_keywords_from_text(text)
        
        return jsonify({
            'keywords': keywords,
            'count': len(keywords)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=DEBUG)
