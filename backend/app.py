from database import Base, engine, SessionLocal
from fastapi import FastAPI, UploadFile, File
import os
import shutil
from pdf_reader import extract_text_from_pdf
from parser import parse_resume
from models import Resume
from sqlalchemy import or_
import json
from ats import analyze_resume
from jd_match import match_resume
from schemas import JobDescriptionRequest
from fastapi.middleware.cors import CORSMiddleware


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
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_pdf(file_path)
    parsed_resume = parse_resume(extracted_text)

    db = SessionLocal()

    resume = Resume(
        name=parsed_resume["name"],
        email=parsed_resume["email"],
        phone=parsed_resume["phone"],
        skills=json.dumps(parsed_resume["skills"]),
        education=json.dumps(parsed_resume["education"]),
        experience=json.dumps(parsed_resume["experience"]),
        projects=json.dumps(parsed_resume["projects"]),
        certifications=json.dumps(parsed_resume["certifications"]),
        github=parsed_resume["github"],
        linkedin=parsed_resume["linkedin"]
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)
    db.close()

    return {
        "message": "Resume parsed successfully",
        "data": parsed_resume
    }

@app.get("/resume/{resume_id}")
def get_resume(resume_id: int):
    db = SessionLocal()

    resume = db.query(Resume).filter(Resume.id == resume_id).first()

    if resume is None:
        db.close()
        return {"message": "Resume not found"}

    resume.skills = json.loads(resume.skills)
    resume.education = json.loads(resume.education)
    resume.experience = json.loads(resume.experience)
    resume.projects=json.loads(resume.projects)
    resume.certifications=json.loads(resume.certifications)


    db.close()

    return resume


@app.get("/resumes")
def get_resumes():
    db = SessionLocal()

    resumes = db.query(Resume).all()

    for resume in resumes:
        resume.skills = json.loads(resume.skills)
        resume.education = json.loads(resume.education)
        resume.experience = json.loads(resume.experience)
        resume.projects=json.loads(resume.projects)
        resume.certifications=json.loads(resume.certifications)
    
        

    db.close()

    return resumes

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
def search_resume(skill:str):
    db=SessionLocal()
    resumes =db.query(Resume).filter(Resume.skills.like(f"%{skill}%")).all()
    db.close()
    return resumes

@app.get("/ats/{resume_id}")
def get_ats_score(resume_id: int):

    db = SessionLocal()

    resume = db.query(Resume).filter(Resume.id == resume_id).first()

    db.close()

    if resume is None:
        return {"message": "Resume not found"}

    resume_text = f"""
Name: {resume.name}

Email:
{resume.email}

Phone:
{resume.phone}

Skills:
{json.loads(resume.skills)}

Education:
{json.loads(resume.education)}

Experience:
{json.loads(resume.experience)}

Projects:
{json.loads(resume.projects)}

Certifications:
{json.loads(resume.certifications)}

GitHub:
{resume.github}

LinkedIn:
{resume.linkedin}
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

    resume_text = f"""
Name:
{resume.name}

Skills:
{json.loads(resume.skills)}

Education:
{json.loads(resume.education)}

Experience:
{json.loads(resume.experience)}

Projects:
{json.loads(resume.projects)}

Certifications:
{json.loads(resume.certifications)}

GitHub:
{resume.github}

LinkedIn:
{resume.linkedin}
"""

    result = match_resume(
        resume_text,
        request.job_description
    )

    return result