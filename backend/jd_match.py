import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


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

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-lite",
        contents=prompt
    )

    return json.loads(response.text)