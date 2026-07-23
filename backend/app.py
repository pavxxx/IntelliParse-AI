from database import Base, engine, SessionLocal
from fastapi import FastAPI, UploadFile, File
import os
import shutil
from pdf_reader import extract_text_from_pdf
from parser import parse_resume
from models import Resume

app = FastAPI()
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
        skills=str(parsed_resume["skills"]),
        education=str(parsed_resume["education"]),
        experience=str(parsed_resume["experience"])
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)
    db.close()

    return {
        "message": "Resume parsed successfully",
        "data": parsed_resume
    }

@app.get("/resumes")
def get_resumes():
    db = SessionLocal()

    resumes = db.query(Resume).all()

    db.close()

    return resumes