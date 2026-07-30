from sqlalchemy import Column, Integer, String, JSON
from database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)
    email = Column(String)
    phone = Column(String)

    skills = Column(JSON)
    education = Column(JSON)
    experience = Column(JSON)
    projects = Column(JSON)
    certifications = Column(JSON)

    github = Column(String)
    linkedin = Column(String)