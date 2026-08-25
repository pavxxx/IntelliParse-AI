# IntelliParse AI

<p align="center">
  <strong>LLM-Powered Document Intelligence & Resume Automation Platform</strong>
</p>

<p align="center">
  Transform unstructured resumes into structured, searchable and actionable candidate intelligence.
</p>

<p align="center">

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.139.2-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-LLM-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-black?style=for-the-badge)

</p>

<p align="center">

![GitHub last commit](https://img.shields.io/github/last-commit/pavxxx/IntelliParse-AI?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/pavxxx/IntelliParse-AI?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/pavxxx/IntelliParse-AI?style=flat-square)

</p>

---

## Overview

**IntelliParse AI** is a full-stack **LLM-powered document intelligence platform** designed to automate resume processing and analysis.

The application takes an unstructured PDF resume, extracts its content, uses a Large Language Model to understand and structure the information, stores the resulting data, and provides an interactive interface for searching, analyzing, and querying candidate information.

IntelliParse supports:

- **Ollama** for local LLM inference during development
- **Google Gemini API** for the deployed/cloud environment

The project combines **document automation, LLM integration, backend API development, database management, and modern frontend development** into a single end-to-end application.

---

# Features

## Resume Document Processing

- Upload PDF resumes
- Extract resume text using PyMuPDF
- Process unstructured resume content with an LLM
- Convert resume information into structured JSON
- Normalize extracted data
- Store structured candidate information in SQLite

---

## Resume Library

Manage processed resumes through a centralized interface.

- View processed resumes
- Search resumes by skills
- Open individual candidate profiles
- Update resume information
- Delete stored resumes
- Maintain structured candidate records

---

## LLM-Powered Resume Chat

Interact with resume information using natural language.

Example queries:

```text
Summarize this candidate.

What are the candidate's technical skills?

Does this candidate have experience with FastAPI?

List the candidate's projects.

What programming languages does this candidate know?

What are the candidate's strongest technical areas?
```

The chatbot can also use job-description context to provide more relevant candidate analysis.

---

## 📊 ATS Analysis

IntelliParse provides ATS-oriented resume analysis to help identify areas that may affect resume compatibility.

The analysis can be used to understand:

- Resume quality
- Skill coverage
- Potential ATS issues
- Areas that can be improved

---

## Job Description Matching

Compare a candidate's resume against a target job description.

The system can identify:

- Matching skills
- Missing skills
- Relevant experience
- Areas of alignment
- Potential skill gaps

Example:

```text
Resume ↔ Job Description

Match: 82%

Matched Skills
✓ Python
✓ FastAPI
✓ SQL
✓ REST APIs

Missing Skills
✗ Docker
✗ AWS

Potential Gap
Cloud deployment experience
```

---

# System Architecture

```mermaid
flowchart TB

    USER["User"]

    subgraph FRONTEND["Frontend Layer"]
        UI["React + Vite"]
        ROUTER["React Router"]
        AXIOS["Axios API Client"]
    end

    subgraph BACKEND["Backend Layer"]
        API["FastAPI REST API"]

        PDF["PDF Text Extraction"]
        PARSER["Resume Parser"]
        NORMALIZER["Data Normalizer"]

        ATS["ATS Analysis"]
        JD["JD Matching"]
        CHAT["Resume Chat"]

        LLM["LLM Service"]
    end

    subgraph AI["LLM Layer"]
        OLLAMA["Ollama<br/>Local LLM"]
        GEMINI["Google Gemini API<br/>Cloud LLM"]
    end

    subgraph DATA["Data Layer"]
        ORM["SQLAlchemy ORM"]
        DB[("SQLite")]
    end

    USER --> UI
    UI --> ROUTER
    ROUTER --> AXIOS
    AXIOS --> API

    API --> PDF
    PDF --> PARSER
    PARSER --> LLM

    LLM --> OLLAMA
    LLM --> GEMINI

    PARSER --> NORMALIZER
    NORMALIZER --> ORM
    ORM --> DB

    API --> ATS
    API --> JD
    API --> CHAT

    ATS --> LLM
    JD --> LLM
    CHAT --> LLM

    DB --> API
    API --> AXIOS
```
---

# ☁️ Deployed Architecture

The deployed application uses **Google Gemini API** for LLM inference instead of the locally hosted Ollama model.

```mermaid
flowchart TB

    USER["User"]

    subgraph CLIENT["Client"]
        BROWSER["Web Browser"]
        FRONTEND["React + Vite"]
    end

    subgraph CLOUD["Deployed Application"]
        BACKEND["FastAPI Backend"]

        subgraph PROCESSING["Document Processing"]
            PDF["PyMuPDF"]
            PARSER["Resume Parser"]
            NORMALIZER["Data Normalizer"]
        end

        ATS["ATS Analysis"]
        JDM["JD Matching"]
        CHAT["Resume Chat"]
    end

    GEMINI["Google Gemini API"]

    DATABASE[("SQLite Database")]

    USER --> BROWSER
    BROWSER --> FRONTEND

    FRONTEND -->|"HTTPS REST API"| BACKEND

    BACKEND --> PDF
    PDF --> PARSER
    PARSER --> NORMALIZER

    NORMALIZER --> DATABASE

    BACKEND --> ATS
    BACKEND --> JDM
    BACKEND --> CHAT

    PARSER --> GEMINI
    ATS --> GEMINI
    JDM --> GEMINI
    CHAT --> GEMINI

    DATABASE --> BACKEND
    BACKEND --> FRONTEND
```

---

# Production Request Flow

```mermaid
flowchart LR

    A["Resume PDF"]
    B["React Frontend"]
    C["FastAPI Backend"]
    D["Text Extraction"]
    E["Gemini LLM"]
    F["Structured Resume"]
    G["Database"]
    H["Analysis / Chat"]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
```

---

# Local vs Deployed LLM Architecture

IntelliParse uses a provider-independent LLM service layer.

```mermaid
flowchart LR

    APP["IntelliParse AI"]

    APP --> SERVICE["LLM Service"]

    SERVICE --> LOCAL["Local Development"]
    SERVICE --> CLOUD["Deployment"]

    LOCAL --> OLLAMA["Ollama"]
    OLLAMA --> LOCALMODEL["Local LLM"]

    CLOUD --> GEMINI["Google Gemini API"]
    GEMINI --> CLOUDMODEL["Cloud LLM"]
```

| Environment | LLM Provider | Purpose |
|---|---|---|
| Local Development | Ollama | Local inference without external API dependency |
| Deployment | Google Gemini API | Cloud-based LLM inference |

The application uses the same core processing pipeline in both environments. Only the LLM provider changes based on the environment configuration.

---

# Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Frontend build tool |
| React Router | Client-side routing |
| Tailwind CSS | Styling |
| Framer Motion | UI animations |
| Axios | API communication |

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Pydantic | Data validation |
| SQLAlchemy | ORM |
| python-dotenv | Environment configuration |

## AI & Document Processing

| Technology | Purpose |
|---|---|
| Google Gemini | Cloud LLM |
| Ollama | Local LLM inference |
| PyMuPDF | PDF text extraction |
| Prompt Engineering | Structured information extraction |


# Getting Started

## Prerequisites

Make sure you have:

- Python 3.x
- Node.js 20+
- npm
- Ollama for local LLM inference

For Gemini-based deployment:

- Google Gemini API key

---

# Backend Setup

Clone the repository:

```bash
git clone https://github.com/pavxxx/IntelliParse-AI.git
cd IntelliParse-AI
```

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### macOS / Linux

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# LLM Configuration

## Local Development — Ollama

Install Ollama and download the model you want to use.

Example:

```bash
ollama pull llama3.2
```

Create a `.env` file inside `backend/`:

```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Make sure Ollama is running before starting the backend.

---

## Deployment — Gemini API

For the deployed version, configure Gemini:

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=your_model_name
```

> **Never commit your `.env` file or API keys to GitHub.**

---

#  Run the Backend

From the `backend/` directory:

```bash
uvicorn app:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

# Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# API Overview

The frontend communicates with the backend through REST APIs.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API health/root endpoint |
| `POST` | `/upload-resume` | Upload and process a resume |
| `GET` | `/resumes` | Retrieve stored resumes |
| `GET` | `/resume/{id}` | Retrieve a specific resume |
| `DELETE` | `/resume/{id}` | Delete a stored resume |
| `GET` | `/search` | Search resumes |
| `GET` | `/ats/{id}` | Generate ATS analysis |
| `POST` | `/jd-match/{id}` | Match resume with job description |
| `POST` | `/chat` | Ask questions about a resume |

> Endpoint names should be kept synchronized with the current backend implementation.

---

# How the LLM Is Used

The LLM is not used as a standalone chatbot only.

It participates in multiple stages of the application:

```text
                    Resume
                      │
                      ▼
              Text Extraction
                      │
                      ▼
                LLM Parsing
                      │
                      ▼
             Structured Resume
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       ATS       JD Matching    Chat
          │           │           │
          └───────────┼───────────┘
                      ▼
               Candidate Insights
```

This allows the same structured candidate data to support different workflows.

---

# Use Cases

## Recruiters

IntelliParse can help recruiters:

- Quickly understand candidate profiles
- Search candidates by skills
- Generate candidate summaries
- Ask natural-language questions about resumes
- Compare candidate profiles with job requirements
- Identify relevant and missing skills

## Applicants

The platform can assist applicants with:

- Resume understanding
- ATS-oriented analysis
- Job-description matching
- Skill-gap identification
- Resume improvement workflows

---










