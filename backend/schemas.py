from pydantic import BaseModel
from typing import List, Optional


class JobDescriptionRequest(BaseModel):
    job_description: str


class ConversationMessage(BaseModel):
    role: str      # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    resume_id: int
    job_description: Optional[str] = None
    conversation_history: List[ConversationMessage] = []
    question: str