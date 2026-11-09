from fastapi import APIRouter

from app.core.qdrant import get_qdrant

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    qdrant = "down"
    try:
        get_qdrant().get_collections()
        qdrant = "ok"
    except Exception:
        pass
    return {"status": "ok", "service": "medimind-ai", "qdrant": qdrant}
