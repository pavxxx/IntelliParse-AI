from llm_service import generate_json

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

    return generate_json(prompt)