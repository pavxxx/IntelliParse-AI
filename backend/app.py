from database import Base, engine, SessionLocal
from fastapi import FastAPI, UploadFile, File
import os
import shutil
import time
import re
import json
from pdf_reader import extract_text_from_pdf
from parser import parse_resume
from models import Resume
from ats import analyze_resume
from jd_match import match_resume
from schemas import JobDescriptionRequest, ChatRequest
from chat import chat_with_resume
from fastapi.middleware.cors import CORSMiddleware
from normalizer import (
    normalize_parsed_resume,
    serialize_for_db,
    format_resume_response,
)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Welcome to IntelliParse AI"}


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    t0 = time.time()

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # --------------------------------------------------
    # 1. Extract text from PDF
    # --------------------------------------------------
    t_pdf_start = time.time()

    extracted_text = extract_text_from_pdf(file_path)
    cleaned_text = re.sub(r'\n{3,}', '\n\n', extracted_text).strip()

    t_pdf_end = time.time()
    print(f"[PERF] PDF extraction: {t_pdf_end - t_pdf_start:.2f}s")

    # --------------------------------------------------
    # 2. Parse resume using LLM
    # --------------------------------------------------
    t_llm_start = time.time()

    raw_parsed = parse_resume(cleaned_text)

    t_llm_end = time.time()
    print(f"[PERF] LLM generation: {t_llm_end - t_llm_start:.2f}s")

    # --------------------------------------------------
    # 3. Normalize parsed data
    # --------------------------------------------------
    norm_parsed = normalize_parsed_resume(raw_parsed)
    db_fields = serialize_for_db(norm_parsed)

    # --------------------------------------------------
    # 4. CREATE or UPDATE resume
    # --------------------------------------------------
    t_db_start = time.time()

    db = SessionLocal()

    try:
        # Find existing resume using email
        existing_resume = None

        email = db_fields.get("email")

        if email:
            existing_resume = (
                db.query(Resume)
                .filter(Resume.email == email)
                .first()
            )

        if existing_resume:
            # ------------------------------------------
            # UPDATE existing resume
            # ------------------------------------------
            for key, value in db_fields.items():
                setattr(existing_resume, key, value)

            db.commit()
            db.refresh(existing_resume)

            resume = existing_resume
            message = "Resume updated successfully"

        else:
            # ------------------------------------------
            # CREATE new resume
            # ------------------------------------------
            resume = Resume(**db_fields)

            db.add(resume)
            db.commit()
            db.refresh(resume)

            message = "Resume created successfully"

        # Format response
        response_data = format_resume_response(resume)
        resume_id = resume.id

    finally:
        db.close()

    t_db_end = time.time()

    print(f"[PERF] DB save: {t_db_end - t_db_start:.2f}s")

    # --------------------------------------------------
    # 5. Total performance
    # --------------------------------------------------
    total_time = time.time() - t0

    print(f"[PERF] Total upload: {total_time:.2f}s")

    return {
        "message": message,
        "resume_id": resume_id,
        "data": response_data
    }

@app.get("/resume/{resume_id}")
def get_resume(resume_id: int):
    db = SessionLocal()
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    db.close()

    if resume is None:
        return {"message": "Resume not found"}

    return format_resume_response(resume)


@app.get("/resumes")
def get_resumes():
    db = SessionLocal()
    resumes = db.query(Resume).all()
    db.close()

    return [format_resume_response(r) for r in resumes]


@app.delete("/resume/{resume_id}")
def delete_resume(resume_id: int):
    db = SessionLocal()
    resume = db.query(Resume).filter(Resume.id == resume_id).first()

    if resume is None:
        db.close()
        return {"message": "Resume not found"}

    db.delete(resume)
    db.commit()
    db.close()

    return {"message": "Resume deleted successfully"}


@app.get("/search")
def search_resume(skill: str):
    db = SessionLocal()
    resumes = db.query(Resume).filter(Resume.skills.like(f"%{skill}%")).all()
    db.close()

    return [format_resume_response(r) for r in resumes]


@app.get("/ats/{resume_id}")
def get_ats_score(resume_id: int):
    db = SessionLocal()
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    db.close()

    if resume is None:
        return {"message": "Resume not found"}

    formatted = format_resume_response(resume)

    resume_text = f"""
Name: {formatted['name']}
Email: {formatted['email']}
Phone: {formatted['phone']}
Skills: {json.dumps(formatted['skills'])}
Education: {json.dumps(formatted['education'])}
Experience: {json.dumps(formatted['experience'])}
Projects: {json.dumps(formatted['projects'])}
Certifications: {json.dumps(formatted['certifications'])}
GitHub: {formatted['github']}
LinkedIn: {formatted['linkedin']}
"""
    analysis = analyze_resume(resume_text)
    return analysis


@app.post("/jd-match/{resume_id}")
def jd_match(resume_id: int, request: JobDescriptionRequest):
    db = SessionLocal()
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    db.close()

    if resume is None:
        return {"message": "Resume not found"}

    formatted = format_resume_response(resume)

    resume_text = f"""
Name: {formatted['name']}
Skills: {json.dumps(formatted['skills'])}
Education: {json.dumps(formatted['education'])}
Experience: {json.dumps(formatted['experience'])}
Projects: {json.dumps(formatted['projects'])}
Certifications: {json.dumps(formatted['certifications'])}
GitHub: {formatted['github']}
LinkedIn: {formatted['linkedin']}
"""

    result = match_resume(
        resume_text,
        request.job_description
    )

    return result


@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    db = SessionLocal()
    resume = db.query(Resume).filter(Resume.id == request.resume_id).first()
    db.close()

    if resume is None:
        return {"error": f"Resume with id {request.resume_id} not found."}

    resume_dict = format_resume_response(resume)

    history = [{"role": m.role, "content": m.content} for m in request.conversation_history]

    reply = chat_with_resume(
        resume_dict=resume_dict,
        question=request.question,
        conversation_history=history,
        job_description=request.job_description,
    )

    return {"reply": reply}
