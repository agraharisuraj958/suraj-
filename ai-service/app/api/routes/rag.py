from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sse_starlette.sse import EventSourceResponse
from app.core.security import require_api_key
from app.services.llm.generator import generate_rag_stream

router = APIRouter(prefix="/api/rag", tags=["rag"])

class ChatRequest(BaseModel):
    query: str
    patientId: Optional[str] = None

@router.post("/chat", dependencies=[Depends(require_api_key)])
async def chat_stream(request: ChatRequest):
    return EventSourceResponse(
        generate_rag_stream(request.query, request.patientId)
    )