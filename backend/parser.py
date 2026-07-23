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
You are an AI Resume Parser.

Extract the resume into the following JSON.

Return ONLY valid JSON.

{{
    "name": "",
    "email": "",
    "phone": "",
    "skills": [],
    "education": [],
    "experience": []
}}

Resume:

{text}
"""

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-lite",
        contents=prompt
    )

    return json.loads(response.text)