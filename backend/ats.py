from llm_service import generate_json

def analyze_resume(text):

    prompt = f"""
You are an ATS (Applicant Tracking System).

Analyze the following resume.

Return ONLY valid JSON.

Format:

{{
    "score": 0,
    "strengths": [],
    "weaknesses": [],
    "suggestions": []
}}

Resume:

{text}
"""

    return generate_json(prompt)