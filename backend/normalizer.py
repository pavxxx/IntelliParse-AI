import json


def normalize_field_list(val, default_item_factory=None):
    """Normalize val into a python list."""
    if val is None:
        return []
    if isinstance(val, list):
        items = val
    elif isinstance(val, str):
        val_str = val.strip()
        if val_str.startswith("[") and val_str.endswith("]"):
            try:
                items = json.loads(val_str)
                if not isinstance(items, list):
                    items = [items]
            except Exception:
                items = [val_str]
        elif val_str:
            items = [s.strip() for s in val_str.split(",") if s.strip()]
        else:
            items = []
    elif isinstance(val, dict):
        items = [val]
    else:
        items = [val]

    if default_item_factory:
        return [default_item_factory(item) for item in items]
    return items


def normalize_string_field(val) -> str:
    """Normalize val (str, list, dict, null) to a single clean string."""
    if val is None:
        return ""
    if isinstance(val, list):
        clean_list = [str(x).strip() for x in val if x is not None and str(x).strip()]
        return ", ".join(clean_list)
    if isinstance(val, dict):
        return ", ".join(f"{k}: {v}" for k, v in val.items() if v)
    return str(val).strip()


def normalize_skills(val) -> list:
    raw_list = normalize_field_list(val)
    result = []
    for item in raw_list:
        if isinstance(item, list):
            result.extend(normalize_skills(item))
        elif isinstance(item, dict):
            for k, v in item.items():
                result.extend(normalize_skills(v))
        elif item:
            s = str(item).strip()
            if s:
                result.append(s)
    return result


def normalize_education(val) -> list:
    def edu_factory(item):
        if isinstance(item, dict):
            return {
                "degree": normalize_string_field(item.get("degree") or item.get("field") or item.get("title") or ""),
                "institution": normalize_string_field(item.get("institution") or item.get("school") or item.get("university") or ""),
                "year": normalize_string_field(item.get("year") or item.get("graduation_year") or item.get("dates") or item.get("period") or ""),
                "gpa": normalize_string_field(item.get("gpa") or "")
            }
        elif isinstance(item, str):
            return {"degree": item.strip(), "institution": "", "year": "", "gpa": ""}
        else:
            return {"degree": str(item), "institution": "", "year": "", "gpa": ""}

    return normalize_field_list(val, default_item_factory=edu_factory)


def normalize_experience(val) -> list:
    def exp_factory(item):
        if isinstance(item, dict):
            raw_resp = item.get("responsibilities") or item.get("description") or item.get("details") or []
            if isinstance(raw_resp, list):
                resp_list = [str(r).strip() for r in raw_resp if r]
            elif isinstance(raw_resp, str) and raw_resp.strip():
                resp_list = [raw_resp.strip()]
            else:
                resp_list = []

            return {
                "title": normalize_string_field(item.get("title") or item.get("role") or item.get("position") or ""),
                "company": normalize_string_field(item.get("company") or item.get("organization") or ""),
                "period": normalize_string_field(item.get("period") or item.get("duration") or item.get("dates") or ""),
                "responsibilities": resp_list
            }
        elif isinstance(item, str):
            return {"title": item.strip(), "company": "", "period": "", "responsibilities": []}
        else:
            return {"title": str(item), "company": "", "period": "", "responsibilities": []}

    return normalize_field_list(val, default_item_factory=exp_factory)


def normalize_projects(val) -> list:
    def proj_factory(item):
        if isinstance(item, dict):
            tech = item.get("technologies") or item.get("tech_stack") or ""
            if isinstance(tech, list):
                tech_str = ", ".join(str(t).strip() for t in tech if t)
            else:
                tech_str = str(tech).strip()
            return {
                "project_name": normalize_string_field(item.get("project_name") or item.get("name") or item.get("title") or ""),
                "technologies": tech_str,
                "description": normalize_string_field(item.get("description") or item.get("details") or "")
            }
        elif isinstance(item, str):
            return {"project_name": item.strip(), "technologies": "", "description": ""}
        else:
            return {"project_name": str(item), "technologies": "", "description": ""}

    return normalize_field_list(val, default_item_factory=proj_factory)


def normalize_certifications(val) -> list:
    raw_list = normalize_field_list(val)
    result = []
    for item in raw_list:
        if isinstance(item, dict):
            name = item.get("name") or item.get("title") or item.get("certification") or str(item)
            result.append(str(name).strip())
        elif item:
            result.append(str(item).strip())
    return result


def normalize_parsed_resume(data: dict) -> dict:
    """Consolidate raw LLM dict output into clean normalized structure."""
    if not isinstance(data, dict):
        data = {}

    return {
        "name": normalize_string_field(data.get("name")),
        "email": normalize_string_field(data.get("email")),
        "phone": normalize_string_field(data.get("phone")),
        "skills": normalize_skills(data.get("skills")),
        "education": normalize_education(data.get("education")),
        "experience": normalize_experience(data.get("experience")),
        "projects": normalize_projects(data.get("projects")),
        "certifications": normalize_certifications(data.get("certifications")),
        "github": normalize_string_field(data.get("github")),
        "linkedin": normalize_string_field(data.get("linkedin")),
    }


def serialize_for_db(norm_data: dict) -> dict:
    """JSON-encode array/dict fields for SQLite storage."""
    return {
        "name": norm_data["name"],
        "email": norm_data["email"],
        "phone": norm_data["phone"],
        "skills": json.dumps(norm_data["skills"]),
        "education": json.dumps(norm_data["education"]),
        "experience": json.dumps(norm_data["experience"]),
        "projects": json.dumps(norm_data["projects"]),
        "certifications": json.dumps(norm_data["certifications"]),
        "github": norm_data["github"],
        "linkedin": norm_data["linkedin"],
    }


def deserialize_json_field(val, default):
    """Safely deserialize JSON string or return existing structure."""
    if val is None:
        return default
    if isinstance(val, (list, dict)):
        return val
    if isinstance(val, str):
        val_str = val.strip()
        if not val_str:
            return default
        try:
            return json.loads(val_str)
        except Exception:
            return default
    return default


def format_resume_response(resume) -> dict:
    """Format SQLAlchemy Resume ORM instance into clean dict for FastAPI responses."""
    if resume is None:
        return None
    return {
        "id": resume.id,
        "name": resume.name or "",
        "email": resume.email or "",
        "phone": resume.phone or "",
        "skills": deserialize_json_field(resume.skills, []),
        "education": deserialize_json_field(resume.education, []),
        "experience": deserialize_json_field(resume.experience, []),
        "projects": deserialize_json_field(resume.projects, []),
        "certifications": deserialize_json_field(resume.certifications, []),
        "github": resume.github or "",
        "linkedin": resume.linkedin or ""
    }
