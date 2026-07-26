import os
from dotenv import load_dotenv
from google import genai
import json

# Load variables from .env
load_dotenv()

# Create Gemini client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def parse_resume(text):
    prompt = f"""
Convert the following resume into JSON.

Return ONLY valid JSON.

Format:

{{
    "name": "",
    "email": "",
    "phone": "",
    "skills": [],
    "education": [],
    "experience": [],
    "projects": [],
    "certifications": [],
    "github": "",
    "linkedin": ""
}}

Extract every project mentioned.

For each project include:
- project_name
- technologies
- description

Extract all certifications.
Extract GitHub URL if available.
Extract LinkedIn URL if available.

Resume:

{text}
"""

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-lite",
        contents=prompt
    )

    return json.loads(response.text)