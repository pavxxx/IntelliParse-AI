from fastapi import FastAPI, UploadFile, File
import os
import shutil
from pdf_reader import extract_text_from_pdf

app = FastAPI()

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

    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "text": extracted_text
    }