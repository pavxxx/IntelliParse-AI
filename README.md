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
