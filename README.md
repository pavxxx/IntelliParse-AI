# IntelliParse AI

<p align="center">
  <b>LLM-Powered Document Intelligence & Resume Automation Platform</b>
</p>

<p align="center">
  Transform unstructured resumes into structured, searchable and actionable candidate intelligence.
</p>

<p align="center">

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.139.2-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-LLM-8E75B2?style=for-the-badge&logo=google)
![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-black?style=for-the-badge)

</p>

<p align="center">

![GitHub last commit](https://img.shields.io/github/last-commit/pavxxx/IntelliParse-AI?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/pavxxx/IntelliParse-AI?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/pavxxx/IntelliParse-AI?style=flat-square)

</p>

---

## 📌 Overview

**IntelliParse AI** is a full-stack document intelligence platform designed to automate resume processing and analysis.

Instead of manually reviewing unstructured PDF resumes, IntelliParse extracts resume content, uses an LLM to understand and structure the information, stores the processed data, and provides an interactive interface for searching, analyzing and querying candidate information.

The system supports **local LLM inference using Ollama** during development and **Google Gemini API** for cloud/deployed environments.

---

## ✨ Features

### 📄 Intelligent Resume Processing

- Upload PDF resumes
- Extract text from documents
- Parse unstructured resume content using an LLM
- Convert resume information into structured JSON
- Normalize extracted data
- Persist structured candidate information in SQLite

### 📚 Resume Library

- Browse processed resumes
- Search candidates by skills
- View structured resume information
- Update stored resume information
- Delete resumes when required

### 🤖 LLM-Powered Resume Chat

Interact with resume data using natural language.

Example queries:

```text
"Summarize this candidate."

"What are the candidate's technical skills?"

"Does this candidate have experience with FastAPI?"

"List the candidate's projects."

"What technologies does this candidate know?"
```

## System Architecture

```mermaid
flowchart TD

    User["User"]

    Frontend["React + Vite Frontend"]

    API["FastAPI Backend"]

    PDF["PDF Text Extraction<br/>PyMuPDF"]

    Parser["Resume Parser"]

    LLM["LLM Service"]

    Ollama["Ollama<br/>Local LLM"]

    Gemini["Gemini API<br/>Cloud LLM"]

    Normalizer["Resume Normalizer"]

    Database[("SQLite Database")]

    ATS["ATS Analysis"]

    JD["Job Description Matching"]

    Chat["Resume Chat"]

    User --> Frontend

    Frontend --> API

    API --> PDF

    PDF --> Parser

    Parser --> LLM

    LLM --> Ollama
    LLM --> Gemini

    Parser --> Normalizer

    Normalizer --> Database

    Database --> API

    API --> ATS
    API --> JD
    API --> Chat

    ATS --> LLM
    JD --> LLM
    Chat --> LLM

    API --> Frontend
```
## Deployment Architecture

```mermaid
flowchart TB

    USER["User"]

    subgraph CLIENT["Client"]
        BROWSER["Web Browser"]
        FRONTEND["React + Vite"]
    end

    subgraph CLOUD["Cloud Deployment"]
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
    FRONTEND -->|HTTPS REST API| BACKEND

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
