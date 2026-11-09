import os
from pathlib import Path

from qdrant_client import QdrantClient

from app.core.config import settings

# Create a global variable to hold the single instance
_qdrant_client = None


def _resolve_qdrant_dir() -> Path:
    base_dir = Path(__file__).resolve().parents[2] / "data" / "qdrant"
    base_dir.mkdir(parents=True, exist_ok=True)

    # Uvicorn --reload spawns multiple workers; each worker must have its own local Qdrant
    # storage directory or Windows raises a lock error on the shared .lock file.
    preferred_dir = base_dir
    try:
        QdrantClient(path=str(preferred_dir))
    except RuntimeError as exc:
        if "already accessed by another instance" not in str(exc):
            raise
        fallback_dir = base_dir.parent / f"qdrant-{os.getpid()}"
        fallback_dir.mkdir(parents=True, exist_ok=True)
        return fallback_dir

    return preferred_dir


def get_qdrant_client() -> QdrantClient:
    global _qdrant_client

    qdrant_dir = _resolve_qdrant_dir()

    # Only initialize the client if it doesn't exist yet
    if _qdrant_client is None:
        _qdrant_client = QdrantClient(path=str(qdrant_dir))

    return _qdrant_client