from llm_service import generate_json

def parse_resume(text):
    prompt = f"""Extract the resume details into valid JSON matching this schema:
{{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "education": [
    {{
      "degree": "",
      "institution": "",
      "year": "",
      "gpa": ""
    }}
  ],
  "experience": [
    {{
      "title": "",
      "company": "",
      "period": "",
      "responsibilities": []
    }}
  ],
  "projects": [
    {{
      "project_name": "",
      "technologies": "",
      "description": ""
    }}
  ],
  "certifications": [],
  "github": "",
  "linkedin": ""
}}

Rules:
1. Return ONLY valid JSON.
2. Extract all skills, education items, work experiences, projects, certifications, GitHub, and LinkedIn URLs.
3. If a field is missing, use empty string "" or empty list [].

Resume Text:
{text}

"""

    print(f"[PERF] Resume text length: {len(text)} characters")
    print(f"[PERF] Prompt length: {len(prompt)} characters")

    return generate_json(prompt)

