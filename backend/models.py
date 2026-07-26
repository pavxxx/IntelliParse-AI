from sqlalchemy import Column, Integer, String, Text
from database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)

    skills = Column(Text)
    education = Column(Text)
    experience = Column(Text)
    projects = Column(Text)
    certifications = Column(Text)
    github = Column(String)
    linkedin = Column(String)