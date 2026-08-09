from llm_service import generate_json


def match_resume(resume_text, job_description):

    prompt = f"""
You are an AI recruitment assistant.

Compare the resume with the following job description.

Return ONLY valid JSON.

Format:

{{
    "match_score": 0,
    "matched_skills": [],
    "missing_skills": [],
    "strengths": [],
    "recommendation": ""
}}

Resume:

{resume_text}

Job Description:

{job_description}
"""

    return generate_json(prompt)