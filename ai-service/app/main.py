from fastapi import FastAPI, Depends
from app.core.security import require_api_key
from app.core.qdrant import get_qdrant_client
from app.api.routes import ingest, rag
from app.core.gemini_health import check_gemini_model_availability

app = FastAPI(title="MediMind AI Service")

@app.on_event("startup")
def startup_check():
    check_gemini_model_availability()

# Mount routers
app.include_router(ingest.router)
app.include_router(rag.router)

@app.get("/health")
def health_check():
    client = get_qdrant_client()
    return {"status": "ok", "qdrant": "configured"}

@app.get("/api/protected", dependencies=[Depends(require_api_key)])
def protected_route():
    return {"message": "You have valid internal credentials."}