import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

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

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-lite",
        contents=prompt
    )

    return json.loads(response.text)