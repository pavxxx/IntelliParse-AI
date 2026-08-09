import json
from llm_service import generate_text

# ---------------------------------------------------------------------------
# System preamble — fixed, token-efficient
# ---------------------------------------------------------------------------
SYSTEM_PREAMBLE = """You are an expert recruiter and career advisor with deep knowledge of:
- Resume evaluation and ATS (Applicant Tracking Systems)
- Technical hiring across software, data, and engineering roles
- Career development, resume writing, and interview preparation

YOUR RULES:
1. Always base candidate facts STRICTLY on the provided Resume JSON.
2. NEVER invent or assume information about the candidate not present in the JSON.
3. If information is missing from the resume, say so explicitly and briefly.
4. You MAY use general career, ATS, and hiring knowledge for recommendations, advice, and comparisons.
5. When a Job Description is provided, always compare it against the resume when relevant.
6. Be concise unless the user explicitly asks for detail.
7. Use professional but direct language.
8. When listing items (skills, suggestions, etc.), use bullet points.
"""


def chat_with_resume(
    resume_dict: dict,
    question: str,
    conversation_history: list,
    job_description: str | None = None
) -> str:
    """
    Construct a single compact prompt and return the assistant reply.

    Args:
        resume_dict: Parsed resume data from SQLite (plain Python dict).
        question: The current user question.
        conversation_history: List of {"role": ..., "content": ...} dicts.
        job_description: Optional job description text.

    Returns:
        The assistant reply as a plain string.
    """
    # Compact JSON serialisation — minimise token usage
    resume_compact = json.dumps(resume_dict, separators=(",", ":"), ensure_ascii=False)

    # Build prompt sections
    sections = [SYSTEM_PREAMBLE]

    sections.append(f"\n--- RESUME JSON ---\n{resume_compact}\n--- END RESUME ---")

    if job_description and job_description.strip():
        sections.append(f"\n--- JOB DESCRIPTION ---\n{job_description.strip()}\n--- END JOB DESCRIPTION ---")

    # Inject conversation history
    if conversation_history:
        sections.append("\n--- CONVERSATION HISTORY ---")
        for turn in conversation_history:
            role_label = "User" if turn["role"] == "user" else "Assistant"
            sections.append(f"{role_label}: {turn['content']}")
        sections.append("--- END HISTORY ---")

    # Current question
    sections.append(f"\nUser: {question}\nAssistant:")

    prompt = "\n".join(sections)

    try:
        return generate_text(prompt)
    except Exception as e:
        print(f"LLM API Error in chat_with_resume: {e}")
        return f"Unable to generate response at this time. (Error: {str(e)})"

