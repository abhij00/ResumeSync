
from fastapi import FastAPI, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, relationship
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from typing import List
import random
import pdfplumber

from database import engine, SessionLocal, Base

# ---------------- MODELS ----------------

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    candidates = relationship(
        "Candidate", back_populates="job", cascade="all, delete-orphan"
    )

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    years = Column(Integer)
    skills = Column(Text)
    resume_text = Column(Text)
    job = relationship("Job", back_populates="candidates")

Base.metadata.create_all(bind=engine)

# ---------------- APP ----------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- UTILS ----------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def extract_text(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

# ---------------- ROUTES ----------------

@app.get("/")
def home():
    return {"message": "Backend Running"}

# --- JOBS ---

@app.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()

@app.get("/jobs/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return {"error": "Job not found"}
    return job

@app.post("/jobs")
def create_job(title: str = Form(...), description: str = Form(""), db: Session = Depends(get_db)):
    new_job = Job(title=title, description=description)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return {"error": "Job not found"}
    db.delete(job)  # Cascade delete will remove candidates
    db.commit()
    return {"message": f"Job {job_id} and its resumes deleted successfully"}

# --- CANDIDATES / RESUMES ---

@app.post("/upload")
async def upload_resumes(resumes: List[UploadFile] = File(...), jobId: int = Form(...), db: Session = Depends(get_db)):
    for file in resumes:
        text = extract_text(file.file)
        name = text.split("\n")[0] if text else "Unknown"
        candidate = Candidate(
            name=name,
            job_id=jobId,
            years=random.randint(1, 5),
            skills="Python, React, SQL",  # Example: can be parsed dynamically later
            resume_text=text
        )
        db.add(candidate)
    db.commit()
    return {"message": f"{len(resumes)} resumes uploaded successfully"}

@app.get("/candidates")
def get_candidates(job_id: int, db: Session = Depends(get_db)):
    return db.query(Candidate).filter(Candidate.job_id == job_id).all()

@app.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        return {"error": "Candidate not found"}
    db.delete(candidate)
    db.commit()
    return {"message": f"Candidate {candidate_id} deleted successfully"}

# --- RANKING ---

def required_skills_by_job(job_id: int) -> List[str]:
    """
    Example placeholder function.
    Replace with your actual skill-mapping logic.
    """
    return ["Python", "React", "SQL"]  # Example: fixed list of required skills

@app.get("/ranking/{job_id}")
def ranking(job_id: int, db: Session = Depends(get_db)):
    candidates = db.query(Candidate).filter(Candidate.job_id == job_id).all()
    job_skills = required_skills_by_job(job_id)

    ranked_candidates = []

    for c in candidates:
        candidate_skills = c.skills.split(",")
        match = len(set(candidate_skills) & set(job_skills))
        score = min(100, match * 30 + c.years * 10)
        ranked_candidates.append({
            "id": c.id,
            "name": c.name,
            "score": score,
            "years": c.years,
            "skills": candidate_skills,
            "justification": f"Matches {match} required skills and has {c.years} years experience"
        })

    ranked_candidates.sort(key=lambda x: x["score"], reverse=True)

    return {"candidates": ranked_candidates}