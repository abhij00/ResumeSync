
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    years = Column(Integer)
    skills = Column(Text)
    resume_text = Column(Text)